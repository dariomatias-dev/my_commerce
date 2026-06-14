package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.SubscriptionContract;
import com.dariomatias.my_commerce.repository.contract.SubscriptionPlanContract;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SubscriptionService")
class SubscriptionServiceTest {

    @Mock
    private UserContract userRepository;

    @Mock
    private SubscriptionContract subscriptionRepository;

    @Mock
    private SubscriptionPlanContract subscriptionPlanRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    private User user;
    private UUID currentPlanId;
    private UUID newPlanId;
    private Subscription activeSubscription;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setRole(UserRole.SUBSCRIBER);

        currentPlanId = UUID.randomUUID();
        newPlanId = UUID.randomUUID();

        activeSubscription = new Subscription();
        activeSubscription.setId(UUID.randomUUID());
        activeSubscription.setUser(user);
        activeSubscription.setPlanId(currentPlanId);
        activeSubscription.setIsActive(true);
    }

    @Nested
    @DisplayName("changePlan")
    class ChangePlan {

        private SubscriptionRequestDTO request;

        @BeforeEach
        void setUp() {
            request = new SubscriptionRequestDTO();
            request.setPlanId(newPlanId);
        }

        @Test
        @DisplayName("sem assinatura ativa deve lançar 400")
        void semAssinaturaAtiva_deveLancar400() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.changePlan(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("mesmo plano deve lançar 400")
        void mesmoPlano_deveLancar400() {
            request.setPlanId(currentPlanId);
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(activeSubscription));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.changePlan(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(subscriptionRepository, never()).update(any());
        }

        @Test
        @DisplayName("plano diferente deve desativar atual e criar nova assinatura")
        void planoDiferente_deveDesativarAtualECriarNova() {
            SubscriptionPlan newPlan = new SubscriptionPlan();
            newPlan.setId(newPlanId);

            Subscription newSubscription = new Subscription();
            newSubscription.setId(UUID.randomUUID());
            newSubscription.setPlanId(newPlanId);
            newSubscription.setIsActive(true);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(activeSubscription));
            when(subscriptionPlanRepository.findById(newPlanId)).thenReturn(Optional.of(newPlan));
            when(subscriptionRepository.save(any(Subscription.class))).thenReturn(newSubscription);

            Subscription result = subscriptionService.changePlan(user, request);

            assertFalse(activeSubscription.getIsActive());
            verify(subscriptionRepository).update(activeSubscription);
            verify(subscriptionRepository).save(any(Subscription.class));
            assertTrue(result.getIsActive());
        }
    }

    @Nested
    @DisplayName("cancelActiveSubscription")
    class CancelActiveSubscription {

        @Test
        @DisplayName("sem assinatura ativa deve lançar 400")
        void semAssinaturaAtiva_deveLancar400() {
            when(subscriptionRepository.findAllByUser_Id(user.getId(), Pageable.unpaged()))
                    .thenReturn(new PageImpl<>(List.of()));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.cancelActiveSubscription(user));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("com assinatura ativa deve cancelar e reverter role do usuário para USER")
        void comAssinaturaAtiva_deveCancelarEAlterarRoleParaUser() {
            when(subscriptionRepository.findAllByUser_Id(user.getId(), Pageable.unpaged()))
                    .thenReturn(new PageImpl<>(List.of(activeSubscription)));
            when(subscriptionRepository.update(activeSubscription)).thenReturn(activeSubscription);
            when(userRepository.update(user)).thenReturn(user);

            Subscription result = subscriptionService.cancelActiveSubscription(user);

            assertFalse(activeSubscription.getIsActive());
            assertEquals(UserRole.USER, user.getRole());
            verify(subscriptionRepository).update(activeSubscription);
            verify(userRepository).update(user);
            assertEquals(activeSubscription, result);
        }
    }
}
