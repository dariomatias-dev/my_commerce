package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanRequestDTO;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import com.dariomatias.my_commerce.service.SubscriptionPlanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(SubscriptionPlanController.class)
class SubscriptionPlanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SubscriptionPlanService service;

    private UUID planId;
    private SubscriptionPlan plan;
    private SubscriptionPlanRequestDTO request;

    @BeforeEach
    void setUp() {
        planId = UUID.randomUUID();

        AuditMetadata audit = new AuditMetadata();
        audit.setCreatedAt(LocalDateTime.now());
        audit.setUpdatedAt(LocalDateTime.now());

        plan = new SubscriptionPlan();
        plan.setId(planId);
        plan.setName("Basic");
        plan.setMaxStores(1);
        plan.setMaxProducts(10);
        plan.setFeatures("Basic features");
        plan.setPrice(new BigDecimal("29.99"));
        plan.setAudit(audit);

        request = new SubscriptionPlanRequestDTO();
        request.setName("Basic");
        request.setMaxStores(1);
        request.setMaxProducts(10);
        request.setFeatures("Basic features");
        request.setPrice(new BigDecimal("29.99"));
    }

    @Nested
    @DisplayName("POST /api/subscription-plans")
    class Create {

        @Test
        @DisplayName("deve criar plano de assinatura")
        void deveRetornarPlanoAoCriarComSucesso() throws Exception {
            when(service.create(any(SubscriptionPlanRequestDTO.class))).thenReturn(plan);

            mockMvc.perform(post("/api/subscription-plans")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("Basic"))
                    .andExpect(jsonPath("$.data.maxStores").value(1))
                    .andExpect(jsonPath("$.data.price").value(29.99));

            verify(service).create(any(SubscriptionPlanRequestDTO.class));
        }
    }

    @Nested
    @DisplayName("GET /api/subscription-plans")
    class GetAll {

        @Test
        @DisplayName("deve retornar página de planos de assinatura")
        void deveRetornarPaginaDePlanos() throws Exception {
            Page<SubscriptionPlan> page = new PageImpl<>(List.of(plan));
            when(service.getAll(any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/subscription-plans")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].name").value("Basic"))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(service).getAll(any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/subscription-plans/{id}")
    class GetById {

        @Test
        @DisplayName("deve retornar plano por ID")
        void deveRetornarPlanoQuandoIdValido() throws Exception {
            when(service.getById(planId)).thenReturn(plan);

            mockMvc.perform(get("/api/subscription-plans/{id}", planId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(planId.toString()))
                    .andExpect(jsonPath("$.data.name").value("Basic"))
                    .andExpect(jsonPath("$.data.maxProducts").value(10));

            verify(service).getById(planId);
        }
    }

    @Nested
    @DisplayName("PATCH /api/subscription-plans/{id}")
    class Update {

        @Test
        @DisplayName("deve atualizar plano de assinatura")
        void deveRetornarPlanoAtualizadoComSucesso() throws Exception {
            SubscriptionPlanRequestDTO updateRequest = new SubscriptionPlanRequestDTO();
            updateRequest.setName("Premium");
            updateRequest.setMaxStores(5);
            updateRequest.setMaxProducts(100);
            updateRequest.setFeatures("Premium features");
            updateRequest.setPrice(new BigDecimal("99.99"));

            plan.setName("Premium");
            plan.setMaxStores(5);
            plan.setMaxProducts(100);
            plan.setPrice(new BigDecimal("99.99"));
            when(service.update(eq(planId), any(SubscriptionPlanRequestDTO.class))).thenReturn(plan);

            mockMvc.perform(patch("/api/subscription-plans/{id}", planId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("Premium"))
                    .andExpect(jsonPath("$.data.maxStores").value(5));

            verify(service).update(eq(planId), any(SubscriptionPlanRequestDTO.class));
        }
    }

    @Nested
    @DisplayName("DELETE /api/subscription-plans/{id}")
    class Delete {

        @Test
        @DisplayName("deve excluir plano de assinatura por ID")
        void deveRetornarSucessoAoExcluirPlano() throws Exception {
            doNothing().when(service).delete(planId);

            mockMvc.perform(delete("/api/subscription-plans/{id}", planId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Plano excluído com sucesso"));

            verify(service).delete(planId);
        }
    }
}
