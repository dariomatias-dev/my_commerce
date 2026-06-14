package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanRequestDTO;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.contract.SubscriptionPlanContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SubscriptionPlanService")
class SubscriptionPlanServiceTest {

    @Mock
    private SubscriptionPlanContract subscriptionPlanRepository;

    @InjectMocks
    private SubscriptionPlanService subscriptionPlanService;

    private SubscriptionPlanRequestDTO request;
    private UUID planId;

    @BeforeEach
    void setUp() {
        planId = UUID.randomUUID();

        request = new SubscriptionPlanRequestDTO();
        request.setName("Plano Pro");
        request.setMaxStores(5);
        request.setMaxProducts(100);
        request.setFeatures("Feature A, Feature B");
        request.setPrice(new BigDecimal("49.90"));
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("nome já existente deve lançar 400")
        void nomeJaExistente_deveLancar400() {
            when(subscriptionPlanRepository.existsByName("Plano Pro")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.create(request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(subscriptionPlanRepository, never()).save(any());
        }

        @Test
        @DisplayName("nome único deve salvar e retornar o plano criado")
        void nomeUnico_deveSalvar() {
            SubscriptionPlan saved = new SubscriptionPlan();
            saved.setId(planId);
            saved.setName("Plano Pro");

            when(subscriptionPlanRepository.existsByName("Plano Pro")).thenReturn(false);
            when(subscriptionPlanRepository.save(any(SubscriptionPlan.class))).thenReturn(saved);

            SubscriptionPlan result = subscriptionPlanService.create(request);

            assertNotNull(result);
            assertEquals("Plano Pro", result.getName());
            verify(subscriptionPlanRepository).save(any(SubscriptionPlan.class));
        }
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        @Test
        @DisplayName("id inexistente deve lançar 404")
        void idInexistente_deveLancar404() {
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.getById(planId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("id existente deve retornar o plano")
        void idExistente_deveRetornarPlano() {
            SubscriptionPlan plan = new SubscriptionPlan();
            plan.setId(planId);
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(plan));

            SubscriptionPlan result = subscriptionPlanService.getById(planId);

            assertNotNull(result);
            assertEquals(planId, result.getId());
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        private SubscriptionPlan existing;

        @BeforeEach
        void setUp() {
            existing = new SubscriptionPlan();
            existing.setId(planId);
            existing.setName("Plano Pro");
            existing.setMaxStores(5);
            existing.setPrice(new BigDecimal("49.90"));
        }

        @Test
        @DisplayName("plano não encontrado deve lançar 404")
        void planoNaoEncontrado_deveLancar404() {
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.update(planId, request));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("nome conflitante com outro plano deve lançar 400")
        void nomeConflitante_deveLancar400() {
            request.setName("Plano Enterprise");

            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(existing));
            when(subscriptionPlanRepository.existsByName("Plano Enterprise")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.update(planId, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(subscriptionPlanRepository, never()).update(any());
        }

        @Test
        @DisplayName("campos null não devem sobrescrever valores existentes")
        void camposNull_naoDevemSobrescrever() {
            SubscriptionPlanRequestDTO partialRequest = new SubscriptionPlanRequestDTO();
            partialRequest.setName(null);
            partialRequest.setMaxStores(null);
            partialRequest.setMaxProducts(null);
            partialRequest.setFeatures(null);
            partialRequest.setPrice(null);

            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(existing));
            when(subscriptionPlanRepository.update(existing)).thenReturn(existing);

            SubscriptionPlan result = subscriptionPlanService.update(planId, partialRequest);

            assertEquals("Plano Pro", result.getName());
            assertEquals(5, result.getMaxStores());
        }

        @Test
        @DisplayName("mesmo nome que o próprio plano não deve checar conflito")
        void mesmoNome_naoDeveChecarConflito() {
            request.setName("Plano Pro"); // mesmo nome

            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(existing));
            when(subscriptionPlanRepository.update(existing)).thenReturn(existing);

            subscriptionPlanService.update(planId, request);

            verify(subscriptionPlanRepository, never()).existsByName(anyString());
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("id inexistente deve lançar 404")
        void idInexistente_deveLancar404() {
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.delete(planId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verify(subscriptionPlanRepository, never()).deleteById(any());
        }

        @Test
        @DisplayName("id existente deve chamar deleteById")
        void idExistente_deveDeletar() {
            SubscriptionPlan plan = new SubscriptionPlan();
            plan.setId(planId);
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(plan));

            subscriptionPlanService.delete(planId);

            verify(subscriptionPlanRepository).deleteById(planId);
        }
    }
}
