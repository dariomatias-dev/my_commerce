package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.LoginRequest;
import com.dariomatias.my_commerce.dto.SignupRequest;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenResponse;
import com.dariomatias.my_commerce.dto.user.UserResponse;
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
            request.setPassword("senha123");
        }

        @Test
        @DisplayName("email não encontrado deve lançar 401")
        void emailNaoEncontrado_deveLancar401() {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> authService.login(request));

            assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
            verifyNoInteractions(auditLogService);
        }

        @Test
        @DisplayName("senha incorreta deve lançar 401 e registrar audit log de falha")
        void senhaIncorreta_deveLancar401ERegistrarAudit() {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("senha123", "encoded-password")).thenReturn(false);

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
        @DisplayName("email não verificado deve lançar 403 e registrar audit log de falha")
        void emailNaoVerificado_deveLancar403ERegistrarAudit() {
            user.setEnabled(false);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("senha123", "encoded-password")).thenReturn(true);

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
        @DisplayName("credenciais válidas deve retornar tokens e registrar audit log de sucesso")
        void credenciaisValidas_deveRetornarTokens() {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("senha123", "encoded-password")).thenReturn(true);
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
            request.setName("João Silva");
            request.setEmail("test@example.com");
            request.setPassword("Senha@123");
        }

        @Test
        @DisplayName("email duplicado deve lançar 409 e registrar audit log de falha")
        void emailDuplicado_deveLancar409ERegistrarAudit() {
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
        @DisplayName("dados válidos deve criar usuário e retornar UserResponse")
        void dadosValidos_deveCriarUsuarioERetornarResponse() throws Exception {
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode("Senha@123")).thenReturn("encoded-password");
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
    @DisplayName("refreshToken")
    class RefreshToken {

        @Test
        @DisplayName("token inválido deve lançar 401 e registrar audit log de falha")
        void tokenInvalido_deveLancar401ERegistrarAudit() {
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
        @DisplayName("token válido deve retornar novos tokens e registrar audit log de sucesso")
        void tokenValido_deveRetornarNovosTokens() {
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
