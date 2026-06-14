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
        request.setName("Pro Plan");
        request.setMaxStores(5);
        request.setMaxProducts(100);
        request.setFeatures("Feature A, Feature B");
        request.setPrice(new BigDecimal("49.90"));
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("existing name should throw 400")
        void existingName_shouldThrow400() {
            when(subscriptionPlanRepository.existsByName("Pro Plan")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.create(request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(subscriptionPlanRepository, never()).save(any());
        }

        @Test
        @DisplayName("unique name should save and return created plan")
        void uniqueName_shouldSave() {
            SubscriptionPlan saved = new SubscriptionPlan();
            saved.setId(planId);
            saved.setName("Pro Plan");

            when(subscriptionPlanRepository.existsByName("Pro Plan")).thenReturn(false);
            when(subscriptionPlanRepository.save(any(SubscriptionPlan.class))).thenReturn(saved);

            SubscriptionPlan result = subscriptionPlanService.create(request);

            assertNotNull(result);
            assertEquals("Pro Plan", result.getName());
            verify(subscriptionPlanRepository).save(any(SubscriptionPlan.class));
        }
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        @Test
        @DisplayName("non-existing id should throw 404")
        void nonExistingId_shouldThrow404() {
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.getById(planId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("existing id should return plan")
        void existingId_shouldReturnPlan() {
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
            existing.setName("Pro Plan");
            existing.setMaxStores(5);
            existing.setPrice(new BigDecimal("49.90"));
        }

        @Test
        @DisplayName("plan not found should throw 404")
        void planNotFound_shouldThrow404() {
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.update(planId, request));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("conflicting name with another plan should throw 400")
        void conflictingName_shouldThrow400() {
            request.setName("Enterprise Plan");

            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(existing));
            when(subscriptionPlanRepository.existsByName("Enterprise Plan")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.update(planId, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(subscriptionPlanRepository, never()).update(any());
        }

        @Test
        @DisplayName("null fields should not overwrite existing values")
        void nullFields_shouldNotOverwriteExistingValues() {
            SubscriptionPlanRequestDTO partialRequest = new SubscriptionPlanRequestDTO();
            partialRequest.setName(null);
            partialRequest.setMaxStores(null);
            partialRequest.setMaxProducts(null);
            partialRequest.setFeatures(null);
            partialRequest.setPrice(null);

            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(existing));
            when(subscriptionPlanRepository.update(existing)).thenReturn(existing);

            SubscriptionPlan result = subscriptionPlanService.update(planId, partialRequest);

            assertEquals("Pro Plan", result.getName());
            assertEquals(5, result.getMaxStores());
        }

        @Test
        @DisplayName("same name as own plan should not check for conflict")
        void sameName_shouldNotCheckConflict() {
            request.setName("Pro Plan");

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
        @DisplayName("non-existing id should throw 404")
        void nonExistingId_shouldThrow404() {
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionPlanService.delete(planId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verify(subscriptionPlanRepository, never()).deleteById(any());
        }

        @Test
        @DisplayName("existing id should call deleteById")
        void existingId_shouldDelete() {
            SubscriptionPlan plan = new SubscriptionPlan();
            plan.setId(planId);
            when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(plan));

            subscriptionPlanService.delete(planId);

            verify(subscriptionPlanRepository).deleteById(planId);
        }
    }
}
