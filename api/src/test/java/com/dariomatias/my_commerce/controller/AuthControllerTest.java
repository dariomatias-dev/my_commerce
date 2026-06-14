package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.dto.*;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenRequest;
import com.dariomatias.my_commerce.dto.refresh_token.RefreshTokenResponse;
import com.dariomatias.my_commerce.dto.user.UserResponse;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    private RefreshTokenResponse tokens;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        tokens = new RefreshTokenResponse("access-token-xyz", "refresh-token-xyz");

        userResponse = new UserResponse(
                UUID.randomUUID(),
                "John Silva",
                "john@example.com",
                UserRole.USER,
                false,
                LocalDateTime.now(),
                LocalDateTime.now(),
                null
        );
    }

    @Nested
    @DisplayName("POST /api/auth/login")
    class Login {

        @Test
        @DisplayName("should return tokens when authenticating with valid credentials")
        void shouldReturnTokensOnAuthentication() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("john@example.com");
            request.setPassword("pass123");

            when(authService.login(any(LoginRequest.class))).thenReturn(tokens);

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.accessToken").value("access-token-xyz"))
                    .andExpect(jsonPath("$.data.refreshToken").value("refresh-token-xyz"));

            verify(authService).login(any(LoginRequest.class));
        }

        @Test
        @DisplayName("should return 400 when email is invalid")
        void shouldReturn400WhenEmailInvalid() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("invalid-email");
            request.setPassword("pass123");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"))
                    .andExpect(jsonPath("$.code").value(400));

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("should return 400 when email is blank")
        void shouldReturn400WhenEmailBlank() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("");
            request.setPassword("pass123");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("should return 400 when password is too short")
        void shouldReturn400WhenPasswordTooShort() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("john@example.com");
            request.setPassword("abc");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/signup")
    class Signup {

        @Test
        @DisplayName("should register new user and return 201")
        void shouldRegisterNewUser() throws Exception {
            SignupRequest request = new SignupRequest();
            request.setName("John Silva");
            request.setEmail("john@example.com");
            request.setPassword("Pass@123");

            when(authService.register(any(SignupRequest.class))).thenReturn(userResponse);

            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.code").value(201))
                    .andExpect(jsonPath("$.data.email").value("john@example.com"));

            verify(authService).register(any(SignupRequest.class));
        }

        @Test
        @DisplayName("should return 400 when name is too short")
        void shouldReturn400WhenNameTooShort() throws Exception {
            SignupRequest request = new SignupRequest();
            request.setName("J");
            request.setEmail("john@example.com");
            request.setPassword("Pass@123");

            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("should return 400 when password does not meet complexity requirements")
        void shouldReturn400WhenPasswordTooWeak() throws Exception {
            SignupRequest request = new SignupRequest();
            request.setName("John Silva");
            request.setEmail("john@example.com");
            request.setPassword("simplepassword");

            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/verify-email")
    class VerifyEmail {

        @Test
        @DisplayName("should verify email with valid token")
        void shouldVerifyEmailWithToken() throws Exception {
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken("token-verification-abc");

            doNothing().when(authService).verifyEmail(anyString());

            mockMvc.perform(post("/api/auth/verify-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Email verified successfully."));

            verify(authService).verifyEmail("token-verification-abc");
        }

        @Test
        @DisplayName("should return 400 when token is blank")
        void shouldReturn400WhenTokenBlank() throws Exception {
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken("");

            mockMvc.perform(post("/api/auth/verify-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/resend-verification-email")
    class ResendVerificationEmail {

        @Test
        @DisplayName("should resend verification email")
        void shouldResendVerificationEmail() throws Exception {
            ResendVerificationEmailRequest request = new ResendVerificationEmailRequest();
            request.setEmail("john@example.com");

            doNothing().when(authService).resendVerificationEmail(anyString());

            mockMvc.perform(post("/api/auth/resend-verification-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Verification email resent successfully."));

            verify(authService).resendVerificationEmail("john@example.com");
        }

        @Test
        @DisplayName("should return 400 when email is invalid")
        void shouldReturn400WhenEmailInvalid() throws Exception {
            ResendVerificationEmailRequest request = new ResendVerificationEmailRequest();
            request.setEmail("not-an-email");

            mockMvc.perform(post("/api/auth/resend-verification-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/recover-password")
    class RecoverPassword {

        @Test
        @DisplayName("should send password recovery email")
        void shouldSendPasswordRecoveryEmail() throws Exception {
            RecoverPasswordRequest request = new RecoverPasswordRequest();
            request.setEmail("john@example.com");

            doNothing().when(authService).recoverPassword(anyString());

            mockMvc.perform(post("/api/auth/recover-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Password recovery email sent successfully."));

            verify(authService).recoverPassword("john@example.com");
        }

        @Test
        @DisplayName("should return 400 when email is blank")
        void shouldReturn400WhenEmailBlank() throws Exception {
            RecoverPasswordRequest request = new RecoverPasswordRequest();
            request.setEmail("");

            mockMvc.perform(post("/api/auth/recover-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/reset-password")
    class ResetPassword {

        @Test
        @DisplayName("should reset password with valid token and new password")
        void shouldResetPassword() throws Exception {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("token-reset-xyz");
            request.setNewPassword("NewPass@123");

            doNothing().when(authService).resetPassword(any(ResetPasswordRequest.class));

            mockMvc.perform(post("/api/auth/reset-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Password reset successfully."));

            verify(authService).resetPassword(any(ResetPasswordRequest.class));
        }

        @Test
        @DisplayName("should return 400 when new password does not meet complexity requirements")
        void shouldReturn400WhenNewPasswordTooWeak() throws Exception {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("token-reset-xyz");
            request.setNewPassword("simplepassword");

            mockMvc.perform(post("/api/auth/reset-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/refresh-token")
    class RefreshToken {

        @Test
        @DisplayName("should return new tokens with valid refresh token")
        void shouldReturnNewTokens() throws Exception {
            RefreshTokenRequest request = new RefreshTokenRequest();
            request.setRefreshToken("refresh-token-xyz");

            RefreshTokenResponse newTokens = new RefreshTokenResponse("new-access-token", "new-refresh-token");
            when(authService.refreshToken(anyString())).thenReturn(newTokens);

            mockMvc.perform(post("/api/auth/refresh-token")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.accessToken").value("new-access-token"))
                    .andExpect(jsonPath("$.data.refreshToken").value("new-refresh-token"));

            verify(authService).refreshToken("refresh-token-xyz");
        }
    }
}
