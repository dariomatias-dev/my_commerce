package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.config.TestWebMvcConfig;
import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.dto.stores.StoreResponseDTO;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import com.dariomatias.my_commerce.service.StoreService;
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
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockMultipartFile;
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

@ControllerTest(StoreController.class)
@Import(TestWebMvcConfig.class)
class StoreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private StoreService service;

    private UUID storeId;
    private UUID userId;
    private User mockUser;
    private Store store;
    private StoreRequestDTO storeRequest;

    @BeforeEach
    void setUp() {
        storeId = UUID.randomUUID();
        userId = UUID.randomUUID();

        AuditMetadata audit = new AuditMetadata();
        audit.setCreatedAt(LocalDateTime.now());
        audit.setUpdatedAt(LocalDateTime.now());

        mockUser = new User();
        mockUser.setId(userId);
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("hashedpassword");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, List.of())
        );

        store = new Store();
        store.setId(storeId);
        store.setName("Minha Loja");
        store.setSlug("minha-loja");
        store.setDescription("Loja de teste");
        store.setThemeColor("#FF5733");
        store.setIsActive(true);
        store.setUserId(userId);
        store.setAudit(audit);

        storeRequest = new StoreRequestDTO();
        storeRequest.setName("Minha Loja");
        storeRequest.setDescription("Loja de teste");
        storeRequest.setThemeColor("#FF5733");
        storeRequest.setIsActive(true);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("POST /api/stores")
    class Create {

        @Test
        @DisplayName("deve criar loja com multipart (data + logo + banner)")
        void deveCriarLoja() throws Exception {
            when(service.create(any(User.class), any(StoreRequestDTO.class), any(), any())).thenReturn(store);

            MockMultipartFile dataPart = new MockMultipartFile(
                    "data", "data", "application/json",
                    objectMapper.writeValueAsBytes(storeRequest)
            );
            MockMultipartFile logoPart = new MockMultipartFile("logo", "logo.jpg", "image/jpeg", "logo".getBytes());
            MockMultipartFile bannerPart = new MockMultipartFile("banner", "banner.jpg", "image/jpeg", "banner".getBytes());

            mockMvc.perform(multipart("/api/stores")
                            .file(dataPart)
                            .file(logoPart)
                            .file(bannerPart))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(storeId.toString()))
                    .andExpect(jsonPath("$.data.name").value("Minha Loja"));

            verify(service).create(any(User.class), any(StoreRequestDTO.class), any(), any());
        }
    }

    @Nested
    @DisplayName("GET /api/stores")
    class GetAll {

        @Test
        @DisplayName("deve retornar página de lojas com query params")
        void deveRetornarPaginaDeLojas() throws Exception {
            Page<Store> page = new PageImpl<>(List.of(store));
            when(service.getAllStores(any(User.class), any(), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/stores")
                            .param("page", "0")
                            .param("size", "10")
                            .param("userId", userId.toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(storeId.toString()))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(service).getAllStores(any(User.class), any(), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/stores/me")
    class GetMyStores {

        @Test
        @DisplayName("deve retornar lojas do usuário autenticado")
        void deveRetornarLojasDoUsuarioAutenticado() throws Exception {
            Page<Store> page = new PageImpl<>(List.of(store));
            when(service.getAllStores(any(User.class), any(), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/stores/me")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].slug").value("minha-loja"));

            verify(service).getAllStores(any(User.class), any(), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/stores/{id}")
    class GetById {

        @Test
        @DisplayName("deve retornar loja por ID")
        void deveRetornarLojaPorId() throws Exception {
            when(service.getById(eq(storeId), any(User.class))).thenReturn(store);

            mockMvc.perform(get("/api/stores/{id}", storeId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(storeId.toString()))
                    .andExpect(jsonPath("$.data.name").value("Minha Loja"));

            verify(service).getById(eq(storeId), any(User.class));
        }
    }

    @Nested
    @DisplayName("GET /api/stores/slug/{slug}")
    class GetBySlug {

        @Test
        @DisplayName("deve retornar loja por slug")
        void deveRetornarLojaPorSlug() throws Exception {
            when(service.getBySlug(eq("minha-loja"), nullable(User.class))).thenReturn(store);

            mockMvc.perform(get("/api/stores/slug/{slug}", "minha-loja"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.slug").value("minha-loja"));

            verify(service).getBySlug(eq("minha-loja"), nullable(User.class));
        }
    }

    @Nested
    @DisplayName("GET /api/stores/active/count")
    class GetActiveStoresCount {

        @Test
        @DisplayName("deve retornar contagem de lojas ativas")
        void deveRetornarContagemDeLojas() throws Exception {
            when(service.getActiveStoresCount()).thenReturn(5L);

            mockMvc.perform(get("/api/stores/active/count"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data").value(5));

            verify(service).getActiveStoresCount();
        }
    }

    @Nested
    @DisplayName("PATCH /api/stores/{id}")
    class Update {

        @Test
        @DisplayName("deve atualizar loja com multipart opcional")
        void deveAtualizarLoja() throws Exception {
            storeRequest.setName("Loja Atualizada");
            store.setName("Loja Atualizada");

            when(service.update(eq(storeId), any(), any(User.class), any(), any())).thenReturn(store);

            MockMultipartFile dataPart = new MockMultipartFile(
                    "data", "data", "application/json",
                    objectMapper.writeValueAsBytes(storeRequest)
            );

            mockMvc.perform(multipart(HttpMethod.PATCH, "/api/stores/{id}", storeId)
                            .file(dataPart))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("Loja Atualizada"));

            verify(service).update(eq(storeId), any(), any(User.class), any(), any());
        }
    }

    @Nested
    @DisplayName("DELETE /api/stores/{id}")
    class Delete {

        @Test
        @DisplayName("deve excluir loja por ID")
        void deveExcluirLoja() throws Exception {
            doNothing().when(service).delete(eq(storeId), any(User.class));

            mockMvc.perform(delete("/api/stores/{id}", storeId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Loja excluída com sucesso"));

            verify(service).delete(eq(storeId), any(User.class));
        }
    }
}
