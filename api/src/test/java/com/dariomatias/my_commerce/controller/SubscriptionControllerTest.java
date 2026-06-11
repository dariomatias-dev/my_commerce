package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.config.TestWebMvcConfig;
import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import com.dariomatias.my_commerce.service.SubscriptionService;
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

@ControllerTest(SubscriptionController.class)
@Import(TestWebMvcConfig.class)
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SubscriptionService service;

    private UUID subscriptionId;
    private UUID userId;
    private UUID planId;
    private User mockUser;
    private Subscription subscription;
    private SubscriptionRequestDTO request;

    @BeforeEach
    void setUp() {
        subscriptionId = UUID.randomUUID();
        userId = UUID.randomUUID();
        planId = UUID.randomUUID();

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

        subscription = new Subscription();
        subscription.setId(subscriptionId);
        subscription.setUserId(userId);
        subscription.setPlanId(planId);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusMonths(1));
        subscription.setIsActive(true);
        subscription.setAudit(audit);

        request = new SubscriptionRequestDTO();
        request.setPlanId(planId);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("POST /api/subscriptions")
    class Create {

        @Test
        @DisplayName("deve criar assinatura")
        void deveCriarAssinatura() throws Exception {
            when(service.create(nullable(User.class), any(SubscriptionRequestDTO.class))).thenReturn(subscription);

            mockMvc.perform(post("/api/subscriptions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(subscriptionId.toString()))
                    .andExpect(jsonPath("$.data.isActive").value(true));

            verify(service).create(nullable(User.class), any(SubscriptionRequestDTO.class));
        }
    }

    @Nested
    @DisplayName("GET /api/subscriptions")
    class GetAll {

        @Test
        @DisplayName("deve retornar página de assinaturas")
        void deveRetornarPaginaDeAssinaturas() throws Exception {
            Page<Subscription> page = new PageImpl<>(List.of(subscription));
            when(service.getAll(any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/subscriptions")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(subscriptionId.toString()))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(service).getAll(any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/subscriptions/user/{userId}")
    class GetAllByUser {

        @Test
        @DisplayName("deve retornar assinaturas por usuário")
        void deveRetornarAssinaturasPorUsuario() throws Exception {
            Page<Subscription> page = new PageImpl<>(List.of(subscription));
            when(service.getAllByUser(eq(userId), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/subscriptions/user/{userId}", userId)
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].userId").value(userId.toString()));

            verify(service).getAllByUser(eq(userId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/subscriptions/user/me")
    class GetAllByMe {

        @Test
        @DisplayName("deve retornar assinaturas do usuário autenticado")
        void deveRetornarAssinaturasDoUsuarioAutenticado() throws Exception {
            Page<Subscription> page = new PageImpl<>(List.of(subscription));
            when(service.getAllByUser(eq(userId), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/subscriptions/user/me")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].isActive").value(true));

            verify(service).getAllByUser(eq(userId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/subscriptions/me/active")
    class GetActiveByMe {

        @Test
        @DisplayName("deve retornar assinatura ativa do usuário autenticado")
        void deveRetornarAssinaturaAtiva() throws Exception {
            when(service.getActiveByUser(eq(userId))).thenReturn(subscription);

            mockMvc.perform(get("/api/subscriptions/me/active"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(subscriptionId.toString()))
                    .andExpect(jsonPath("$.data.isActive").value(true));

            verify(service).getActiveByUser(eq(userId));
        }
    }

    @Nested
    @DisplayName("GET /api/subscriptions/{id}")
    class GetById {

        @Test
        @DisplayName("deve retornar assinatura por ID")
        void deveRetornarAssinaturaPorId() throws Exception {
            when(service.getById(eq(subscriptionId))).thenReturn(subscription);

            mockMvc.perform(get("/api/subscriptions/{id}", subscriptionId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(subscriptionId.toString()))
                    .andExpect(jsonPath("$.data.planId").value(planId.toString()));

            verify(service).getById(eq(subscriptionId));
        }
    }

    @Nested
    @DisplayName("PATCH /api/subscriptions/change-plan")
    class ChangePlan {

        @Test
        @DisplayName("deve alterar plano de assinatura")
        void deveAlterarPlanoDeAssinatura() throws Exception {
            UUID newPlanId = UUID.randomUUID();
            SubscriptionRequestDTO changePlanRequest = new SubscriptionRequestDTO();
            changePlanRequest.setPlanId(newPlanId);

            subscription.setPlanId(newPlanId);
            when(service.changePlan(nullable(User.class), any(SubscriptionRequestDTO.class))).thenReturn(subscription);

            mockMvc.perform(patch("/api/subscriptions/change-plan")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(changePlanRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.planId").value(newPlanId.toString()));

            verify(service).changePlan(nullable(User.class), any(SubscriptionRequestDTO.class));
        }
    }

    @Nested
    @DisplayName("PATCH /api/subscriptions/cancel")
    class CancelActive {

        @Test
        @DisplayName("deve cancelar assinatura ativa")
        void deveCancelarAssinaturaAtiva() throws Exception {
            subscription.setIsActive(false);
            when(service.cancelActiveSubscription(nullable(User.class))).thenReturn(subscription);

            mockMvc.perform(patch("/api/subscriptions/cancel"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.isActive").value(false))
                    .andExpect(jsonPath("$.message").value("Assinatura cancelada com sucesso"));

            verify(service).cancelActiveSubscription(nullable(User.class));
        }
    }
}
