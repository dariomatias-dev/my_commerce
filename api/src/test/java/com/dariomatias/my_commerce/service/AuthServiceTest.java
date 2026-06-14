package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.LoginRequest;
import com.dariomatias.my_commerce.dto.ResetPasswordRequest;
import com.dariomatias.my_commerce.dto.SignupRequest;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenResponse;
import com.dariomatias.my_commerce.dto.user.UserResponse;
import jakarta.mail.MessagingException;
import com.dariomatias.my_commerce.enums.AuditLogAction;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService")
class AuthServiceTest {

    @Mock
    private UserContract userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @SuppressWarnings("unchecked")
    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");
        user.setPassword("encoded-password");
        user.setEnabled(true);
        user.setRole(UserRole.USER);
    }

    @Nested
    @DisplayName("login")
    class Login {

        private LoginRequest request;

        @BeforeEach
        void setUp() {
            request = new LoginRequest();
            request.setEmail("test@example.com");
            request.setPassword("pass123");
        }

        @Test
        @DisplayName("email not found should throw 401")
        void emailNotFound_shouldThrow401() {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.login(request));

            assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
            verifyNoInteractions(auditLogService);
        }

        @Test
        @DisplayName("wrong password should throw 401 and log audit failure")
        void wrongPassword_shouldThrow401AndLogAudit() {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("pass123", "encoded-password")).thenReturn(false);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.login(request));

            assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.LOGIN),
                    eq("failure"),
                    anyMap()
            );
        }

        @Test
        @DisplayName("unverified email should throw 403 and log audit failure")
        void unverifiedEmail_shouldThrow403AndLogAudit() {
            user.setEnabled(false);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("pass123", "encoded-password")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.login(request));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.LOGIN),
                    eq("failure"),
                    anyMap()
            );
        }

        @Test
        @DisplayName("valid credentials should return tokens and log audit success")
        void validCredentials_shouldReturnTokens() {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("pass123", "encoded-password")).thenReturn(true);
            when(jwtService.generateAccessToken(user)).thenReturn("access-token");
            when(jwtService.generateRefreshToken(user)).thenReturn("refresh-token");

            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);

            RefreshTokenResponse result = authService.login(request);

            assertEquals("access-token", result.accessToken());
            assertEquals("refresh-token", result.refreshToken());
            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.LOGIN),
                    eq("success"),
                    anyMap()
            );
        }
    }

    @Nested
    @DisplayName("register")
    class Register {

        private SignupRequest request;

        @BeforeEach
        void setUp() {
            request = new SignupRequest();
            request.setName("John Silva");
            request.setEmail("test@example.com");
            request.setPassword("Pass@123");
        }

        @Test
        @DisplayName("duplicate email should throw 409 and log audit failure")
        void duplicateEmail_shouldThrow409AndLogAudit() {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.register(request));

            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.SIGNUP),
                    eq("failure"),
                    anyMap()
            );
        }

        @Test
        @DisplayName("valid data should create user and return UserResponse")
        void validData_shouldCreateUserAndReturnResponse() throws Exception {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode("Pass@123")).thenReturn("encoded-password");
            when(userRepository.save(any(User.class))).thenAnswer(inv -> {
                User saved = inv.getArgument(0);
                saved.setId(UUID.randomUUID());
                return saved;
            });

            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            doNothing().when(emailService).sendVerificationEmail(anyString(), anyString());

            UserResponse result = authService.register(request);

            assertNotNull(result);
            assertEquals("test@example.com", result.getEmail());
            assertFalse(result.isEnabled());
            verify(auditLogService).log(anyString(), eq(AuditLogAction.SIGNUP), eq("success"), anyMap());
        }
    }

    @Nested
    @DisplayName("verifyEmail")
    class VerifyEmail {

        @Test
        @DisplayName("invalid token should throw 400 and log validation failure")
        void invalidToken_shouldThrow400() {
            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(ops.get("email_verification:bad-token")).thenReturn(null);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.verifyEmail("bad-token"));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(auditLogService).log(eq("unknown"), eq(AuditLogAction.VALIDATE_TOKEN), eq("failure"), anyMap());
        }

        @Test
        @DisplayName("valid token should enable user, save and log success")
        void validToken_shouldEnableUserAndLogSuccess() {
            user.setEnabled(false);
            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(ops.get("email_verification:valid-token")).thenReturn(user.getId().toString());
            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

            authService.verifyEmail("valid-token");

            assertTrue(user.isEnabled());
            verify(userRepository).save(user);
            verify(redisTemplate).delete("email_verification:valid-token");
        }
    }

    @Nested
    @DisplayName("resendVerificationEmail")
    class ResendVerificationEmail {

        @Test
        @DisplayName("email not registered should do nothing")
        void emailNotRegistered_shouldDoNothing() {
            when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

            authService.resendVerificationEmail("ghost@example.com");

            verifyNoInteractions(emailService, auditLogService);
        }

        @Test
        @DisplayName("already verified email should log resend verification failure")
        void alreadyVerifiedEmail_shouldLogFailure() {
            user.setEnabled(true);
            when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

            authService.resendVerificationEmail(user.getEmail());

            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.RESEND_VERIFICATION),
                    eq("failure"),
                    anyMap()
            );
            verifyNoInteractions(emailService);
        }

        @Test
        @DisplayName("unverified email should send verification email and log success")
        void unverifiedEmail_shouldSendEmailAndLogSuccess() throws MessagingException {
            user.setEnabled(false);
            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            doNothing().when(emailService).sendVerificationEmail(anyString(), anyString());

            authService.resendVerificationEmail(user.getEmail());

            verify(emailService).sendVerificationEmail(eq(user.getEmail()), anyString());
            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.RESEND_VERIFICATION),
                    eq("success"),
                    anyMap()
            );
        }
    }

    @Nested
    @DisplayName("recoverPassword")
    class RecoverPassword {

        @Test
        @DisplayName("email not registered should do nothing")
        void emailNotRegistered_shouldDoNothing() {
            when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

            authService.recoverPassword("ghost@example.com");

            verifyNoInteractions(emailService, auditLogService);
        }

        @Test
        @DisplayName("registered email should store token in redis and send recovery email")
        void registeredEmail_shouldStoreTokenAndSendRecoveryEmail() throws MessagingException {
            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
            doNothing().when(emailService).sendPasswordRecoveryEmail(anyString(), anyString());

            authService.recoverPassword(user.getEmail());

            verify(ops).set(anyString(), eq(user.getId().toString()), anyLong(), any());
            verify(emailService).sendPasswordRecoveryEmail(eq(user.getEmail()), anyString());
            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.RECOVER_PASSWORD),
                    eq("success"),
                    anyMap()
            );
        }
    }

    @Nested
    @DisplayName("resetPassword")
    class ResetPassword {

        @Test
        @DisplayName("invalid token should throw 400")
        void invalidToken_shouldThrow400() {
            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(ops.get("password_recovery:bad-token")).thenReturn(null);

            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("bad-token");
            request.setNewPassword("NewPass@123");

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.resetPassword(request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid token should update password and delete redis key")
        void validToken_shouldUpdatePasswordAndDeleteRedisKey() {
            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(ops.get("password_recovery:valid-token")).thenReturn(user.getId().toString());
            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(passwordEncoder.encode("NewPass@123")).thenReturn("new-encoded-password");

            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("valid-token");
            request.setNewPassword("NewPass@123");

            authService.resetPassword(request);

            assertEquals("new-encoded-password", user.getPassword());
            verify(userRepository).save(user);
            verify(redisTemplate).delete("password_recovery:valid-token");
        }
    }

    @Nested
    @DisplayName("refreshToken")
    class RefreshToken {

        @Test
        @DisplayName("invalid token should throw 401 and log audit failure")
        void invalidToken_shouldThrow401AndLogAudit() {
            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(ops.get("invalid-token")).thenReturn(null);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.refreshToken("invalid-token"));

            assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
            verify(auditLogService).log(
                    eq("unknown"),
                    eq(AuditLogAction.REFRESH_TOKEN),
                    eq("failure"),
                    anyMap()
            );
        }

        @Test
        @DisplayName("valid token should return new tokens and log audit success")
        void validToken_shouldReturnNewTokens() {
            String refreshToken = "valid-refresh-token";

            @SuppressWarnings("unchecked")
            ValueOperations<String, Object> ops = mock(ValueOperations.class);
            when(redisTemplate.opsForValue()).thenReturn(ops);
            when(ops.get(refreshToken)).thenReturn(user.getId().toString());
            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(jwtService.generateAccessToken(user)).thenReturn("new-access-token");
            when(jwtService.generateRefreshToken(user)).thenReturn("new-refresh-token");

            RefreshTokenResponse result = authService.refreshToken(refreshToken);

            assertEquals("new-access-token", result.accessToken());
            assertEquals("new-refresh-token", result.refreshToken());
            verify(redisTemplate).delete(refreshToken);
            verify(auditLogService).log(
                    eq(user.getId().toString()),
                    eq(AuditLogAction.REFRESH_TOKEN),
                    eq("success"),
                    anyMap()
            );
        }
    }
}
