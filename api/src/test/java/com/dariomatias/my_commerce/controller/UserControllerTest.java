package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.config.TestWebMvcConfig;
import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.dto.user.AdminUserResponse;
import com.dariomatias.my_commerce.dto.user.UserFilterDTO;
import com.dariomatias.my_commerce.dto.user.UserRequest;
import com.dariomatias.my_commerce.dto.user.UserResponse;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import com.dariomatias.my_commerce.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(UserController.class)
@Import(TestWebMvcConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    private UUID userId;
    private User mockUser;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        AuditMetadata audit = new AuditMetadata();
        audit.setCreatedAt(LocalDateTime.now());
        audit.setUpdatedAt(LocalDateTime.now());

        mockUser = new User();
        mockUser.setId(userId);
        mockUser.setName("João Silva");
        mockUser.setEmail("joao@example.com");
        mockUser.setPassword("hashedpassword");
        mockUser.setRole(UserRole.USER);
        mockUser.setEnabled(true);
        mockUser.setAudit(audit);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, List.of())
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("GET /api/users")
    class GetAll {

        @Test
        @DisplayName("deve retornar página de usuários")
        void deveRetornarPaginaDeUsuarios() throws Exception {
            Page<User> page = new PageImpl<>(List.of(mockUser));
            when(userService.getAll(any(UserFilterDTO.class), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/users")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(userId.toString()))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(userService).getAll(any(UserFilterDTO.class), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/users/{id}")
    class GetById {

        @Test
        @DisplayName("deve retornar usuário por ID")
        void deveRetornarUsuarioPorId() throws Exception {
            when(userService.getById(nullable(User.class), eq(userId))).thenReturn(mockUser);

            mockMvc.perform(get("/api/users/{id}", userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(userId.toString()))
                    .andExpect(jsonPath("$.data.email").value("joao@example.com"));

            verify(userService).getById(nullable(User.class), eq(userId));
        }
    }

    @Nested
    @DisplayName("PATCH /api/users/{id}")
    class UpdateUser {

        @Test
        @DisplayName("deve atualizar usuário por ID")
        void deveAtualizarUsuarioPorId() throws Exception {
            UserRequest request = new UserRequest();
            request.setName("João Atualizado");

            mockUser.setName("João Atualizado");
            when(userService.update(nullable(User.class), eq(userId), any(UserRequest.class))).thenReturn(mockUser);

            mockMvc.perform(patch("/api/users/{id}", userId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("João Atualizado"));

            verify(userService).update(nullable(User.class), eq(userId), any(UserRequest.class));
        }

        @Test
        @DisplayName("deve retornar 400 quando nome estiver em branco")
        void deveRetornar400QuandoNomeEmBranco() throws Exception {
            UserRequest request = new UserRequest();
            request.setName("");

            mockMvc.perform(patch("/api/users/{id}", userId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"))
                    .andExpect(jsonPath("$.code").value(400));

            verifyNoInteractions(userService);
        }

        @Test
        @DisplayName("deve retornar 400 quando nome for muito curto")
        void deveRetornar400QuandoNomeCurto() throws Exception {
            UserRequest request = new UserRequest();
            request.setName("AB");

            mockMvc.perform(patch("/api/users/{id}", userId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(userService);
        }
    }

    @Nested
    @DisplayName("DELETE /api/users/{id}")
    class DeleteUser {

        @Test
        @DisplayName("deve excluir usuário por ID")
        void deveExcluirUsuarioPorId() throws Exception {
            doNothing().when(userService).delete(nullable(User.class), eq(userId));

            mockMvc.perform(delete("/api/users/{id}", userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("User deleted successfully."));

            verify(userService).delete(nullable(User.class), eq(userId));
        }
    }

    @Nested
    @DisplayName("GET /api/users/stats/active-users")
    class GetActiveUsersCount {

        @Test
        @DisplayName("deve retornar contagem de usuários ativos")
        void deveRetornarContagemDeUsuariosAtivos() throws Exception {
            when(userService.getActiveUsersCount()).thenReturn(42L);

            mockMvc.perform(get("/api/users/stats/active-users"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data").value(42));

            verify(userService).getActiveUsersCount();
        }
    }

    @Nested
    @DisplayName("GET /api/users/me")
    class GetCurrentUser {

        @Test
        @DisplayName("deve retornar usuário autenticado")
        void deveRetornarUsuarioAutenticado() throws Exception {
            when(userService.getById(any(User.class), eq(userId))).thenReturn(mockUser);

            mockMvc.perform(get("/api/users/me"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(userId.toString()))
                    .andExpect(jsonPath("$.data.email").value("joao@example.com"));

            verify(userService).getById(any(User.class), eq(userId));
        }
    }

    @Nested
    @DisplayName("PATCH /api/users/me")
    class UpdateCurrentUser {

        @Test
        @DisplayName("deve atualizar usuário autenticado")
        void deveAtualizarUsuarioAutenticado() throws Exception {
            UserRequest request = new UserRequest();
            request.setName("Nome Novo");

            mockUser.setName("Nome Novo");
            when(userService.update(any(User.class), eq(userId), any(UserRequest.class))).thenReturn(mockUser);

            mockMvc.perform(patch("/api/users/me")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("Nome Novo"));

            verify(userService).update(any(User.class), eq(userId), any(UserRequest.class));
        }

        @Test
        @DisplayName("deve retornar 400 quando nome estiver em branco")
        void deveRetornar400QuandoNomeEmBranco() throws Exception {
            UserRequest request = new UserRequest();
            request.setName("  ");

            mockMvc.perform(patch("/api/users/me")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(userService);
        }
    }

    @Nested
    @DisplayName("POST /api/users/me/change-password")
    class ChangePassword {

        @Test
        @DisplayName("deve alterar senha do usuário autenticado")
        void deveAlterarSenhaDoUsuarioAutenticado() throws Exception {
            PasswordUpdateRequest request = new PasswordUpdateRequest();
            request.setCurrentPassword("SenhaAtual@1");
            request.setNewPassword("NovaSenha@123");

            doNothing().when(userService).changePassword(any(User.class), eq(userId), any(PasswordUpdateRequest.class));

            mockMvc.perform(post("/api/users/me/change-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Password updated successfully."));

            verify(userService).changePassword(any(User.class), eq(userId), any(PasswordUpdateRequest.class));
        }

        @Test
        @DisplayName("deve retornar 400 quando nova senha não atender requisitos de complexidade")
        void deveRetornar400QuandoNovaSenhaFraca() throws Exception {
            PasswordUpdateRequest request = new PasswordUpdateRequest();
            request.setCurrentPassword("SenhaAtual@1");
            request.setNewPassword("senhasimples");

            mockMvc.perform(post("/api/users/me/change-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(userService);
        }

        @Test
        @DisplayName("deve retornar 400 quando senha atual estiver em branco")
        void deveRetornar400QuandoSenhaAtualEmBranco() throws Exception {
            PasswordUpdateRequest request = new PasswordUpdateRequest();
            request.setCurrentPassword("");
            request.setNewPassword("NovaSenha@123");

            mockMvc.perform(post("/api/users/me/change-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(userService);
        }
    }

    @Nested
    @DisplayName("DELETE /api/users/me")
    class DeleteCurrentUser {

        @Test
        @DisplayName("deve excluir usuário autenticado")
        void deveExcluirUsuarioAutenticado() throws Exception {
            doNothing().when(userService).delete(any(User.class), eq(userId));

            mockMvc.perform(delete("/api/users/me"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("User deleted successfully."));

            verify(userService).delete(any(User.class), eq(userId));
        }
    }
}
