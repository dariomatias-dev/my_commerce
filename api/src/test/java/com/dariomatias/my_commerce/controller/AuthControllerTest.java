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
                "João Silva",
                "joao@example.com",
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
        @DisplayName("deve retornar tokens ao autenticar com credenciais válidas")
        void deveRetornarTokensAoAutenticar() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("joao@example.com");
            request.setPassword("senha123");

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
        @DisplayName("deve retornar 400 quando email for inválido")
        void deveRetornar400QuandoEmailInvalido() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("email-invalido");
            request.setPassword("senha123");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"))
                    .andExpect(jsonPath("$.code").value(400));

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("deve retornar 400 quando email estiver em branco")
        void deveRetornar400QuandoEmailEmBranco() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("");
            request.setPassword("senha123");

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("deve retornar 400 quando senha for muito curta")
        void deveRetornar400QuandoSenhaCurta() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setEmail("joao@example.com");
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
        @DisplayName("deve registrar novo usuário e retornar 201")
        void deveRegistrarNovoUsuario() throws Exception {
            SignupRequest request = new SignupRequest();
            request.setName("João Silva");
            request.setEmail("joao@example.com");
            request.setPassword("Senha@123");

            when(authService.register(any(SignupRequest.class))).thenReturn(userResponse);

            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.code").value(201))
                    .andExpect(jsonPath("$.data.email").value("joao@example.com"));

            verify(authService).register(any(SignupRequest.class));
        }

        @Test
        @DisplayName("deve retornar 400 quando nome for muito curto")
        void deveRetornar400QuandoNomeCurto() throws Exception {
            SignupRequest request = new SignupRequest();
            request.setName("J");
            request.setEmail("joao@example.com");
            request.setPassword("Senha@123");

            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("deve retornar 400 quando senha não atender requisitos de complexidade")
        void deveRetornar400QuandoSenhaFraca() throws Exception {
            SignupRequest request = new SignupRequest();
            request.setName("João Silva");
            request.setEmail("joao@example.com");
            request.setPassword("senhasimples");

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
        @DisplayName("deve verificar email com token válido")
        void deveVerificarEmailComToken() throws Exception {
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken("token-verificacao-abc");

            doNothing().when(authService).verifyEmail(anyString());

            mockMvc.perform(post("/api/auth/verify-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Email verified successfully."));

            verify(authService).verifyEmail("token-verificacao-abc");
        }

        @Test
        @DisplayName("deve retornar 400 quando token estiver em branco")
        void deveRetornar400QuandoTokenEmBranco() throws Exception {
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
        @DisplayName("deve reenviar email de verificação")
        void deveReenviarEmailDeVerificacao() throws Exception {
            ResendVerificationEmailRequest request = new ResendVerificationEmailRequest();
            request.setEmail("joao@example.com");

            doNothing().when(authService).resendVerificationEmail(anyString());

            mockMvc.perform(post("/api/auth/resend-verification-email")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Verification email resent successfully."));

            verify(authService).resendVerificationEmail("joao@example.com");
        }

        @Test
        @DisplayName("deve retornar 400 quando email for inválido")
        void deveRetornar400QuandoEmailInvalido() throws Exception {
            ResendVerificationEmailRequest request = new ResendVerificationEmailRequest();
            request.setEmail("nao-e-email");

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
        @DisplayName("deve enviar email de recuperação")
        void deveEnviarEmailDeRecuperacao() throws Exception {
            RecoverPasswordRequest request = new RecoverPasswordRequest();
            request.setEmail("joao@example.com");

            doNothing().when(authService).recoverPassword(anyString());

            mockMvc.perform(post("/api/auth/recover-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Password recovery email sent successfully."));

            verify(authService).recoverPassword("joao@example.com");
        }

        @Test
        @DisplayName("deve retornar 400 quando email estiver em branco")
        void deveRetornar400QuandoEmailEmBranco() throws Exception {
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
        @DisplayName("deve redefinir senha com token e senha válidos")
        void deveRedefinirSenha() throws Exception {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("token-reset-xyz");
            request.setNewPassword("NovaSenha@123");

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
        @DisplayName("deve retornar 400 quando nova senha não atender requisitos de complexidade")
        void deveRetornar400QuandoNovaSenhaFraca() throws Exception {
            ResetPasswordRequest request = new ResetPasswordRequest();
            request.setToken("token-reset-xyz");
            request.setNewPassword("senhasimples");

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
        @DisplayName("deve retornar novos tokens com refresh token válido")
        void deveRetornarNovosTokens() throws Exception {
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
