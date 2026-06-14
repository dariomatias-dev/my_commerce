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
import org.springframework.data.domain.Page;
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
    @DisplayName("create")
    class Create {

        private SubscriptionRequestDTO request;

        @BeforeEach
        void setUp() {
            request = new SubscriptionRequestDTO();
            request.setPlanId(newPlanId);
        }

        @Test
        @DisplayName("user with active subscription should throw 400")
        void userWithActiveSubscription_shouldThrow400() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(activeSubscription));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.create(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(subscriptionRepository, never()).save(any());
        }

        @Test
        @DisplayName("plan not found should throw 404")
        void planNotFound_shouldThrow404() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.empty());
            when(subscriptionPlanRepository.findById(newPlanId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.create(user, request));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid request should create subscription and set user role to SUBSCRIBER")
        void validRequest_shouldCreateSubscriptionAndSetSubscriberRole() {
            SubscriptionPlan plan = new SubscriptionPlan();
            plan.setId(newPlanId);

            Subscription saved = new Subscription();
            saved.setId(UUID.randomUUID());
            saved.setIsActive(true);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.empty());
            when(subscriptionPlanRepository.findById(newPlanId)).thenReturn(Optional.of(plan));
            when(subscriptionRepository.save(any(Subscription.class))).thenReturn(saved);

            Subscription result = subscriptionService.create(user, request);

            assertEquals(UserRole.SUBSCRIBER, user.getRole());
            verify(userRepository).update(user);
            verify(subscriptionRepository).save(any(Subscription.class));
            assertNotNull(result);
        }
    }

    @Nested
    @DisplayName("getAll")
    class GetAll {

        @Test
        @DisplayName("should delegate to repository with pageable")
        void shouldDelegateToRepository() {
            Pageable pageable = Pageable.ofSize(10);
            Page<Subscription> page = new PageImpl<>(List.of(activeSubscription));
            when(subscriptionRepository.findAll(pageable)).thenReturn(page);

            Page<Subscription> result = subscriptionService.getAll(pageable);

            assertEquals(page, result);
            verify(subscriptionRepository).findAll(pageable);
        }
    }

    @Nested
    @DisplayName("getAllByUser")
    class GetAllByUser {

        @Test
        @DisplayName("should delegate to repository with userId and pageable")
        void shouldDelegateToRepository() {
            UUID userId = UUID.randomUUID();
            Pageable pageable = Pageable.ofSize(10);
            Page<Subscription> page = new PageImpl<>(List.of(activeSubscription));
            when(subscriptionRepository.findAllByUser_Id(userId, pageable)).thenReturn(page);

            Page<Subscription> result = subscriptionService.getAllByUser(userId, pageable);

            assertEquals(page, result);
            verify(subscriptionRepository).findAllByUser_Id(userId, pageable);
        }
    }

    @Nested
    @DisplayName("getActiveByUser")
    class GetActiveByUser {

        @Test
        @DisplayName("no active subscription should throw 404")
        void noActiveSubscription_shouldThrow404() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.getActiveByUser(user.getId()));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("active subscription found should return it")
        void activeSubscriptionFound_shouldReturn() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(activeSubscription));

            Subscription result = subscriptionService.getActiveByUser(user.getId());

            assertEquals(activeSubscription, result);
        }
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        @Test
        @DisplayName("subscription not found should throw 404")
        void subscriptionNotFound_shouldThrow404() {
            UUID id = UUID.randomUUID();
            when(subscriptionRepository.findById(id)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.getById(id));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("subscription found should return it")
        void subscriptionFound_shouldReturn() {
            UUID id = activeSubscription.getId();
            when(subscriptionRepository.findById(id)).thenReturn(Optional.of(activeSubscription));

            Subscription result = subscriptionService.getById(id);

            assertEquals(activeSubscription, result);
        }
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
        @DisplayName("no active subscription should throw 400")
        void noActiveSubscription_shouldThrow400() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.changePlan(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("same plan should throw 400")
        void samePlan_shouldThrow400() {
            request.setPlanId(currentPlanId);
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(activeSubscription));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.changePlan(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verify(subscriptionRepository, never()).update(any());
        }

        @Test
        @DisplayName("different plan should deactivate current and create new subscription")
        void differentPlan_shouldDeactivateCurrentAndCreateNew() {
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
        @DisplayName("no active subscription should throw 400")
        void noActiveSubscription_shouldThrow400() {
            when(subscriptionRepository.findAllByUser_Id(user.getId(), Pageable.unpaged()))
                    .thenReturn(new PageImpl<>(List.of()));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> subscriptionService.cancelActiveSubscription(user));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("with active subscription should cancel and revert user role to USER")
        void withActiveSubscription_shouldCancelAndRevertRoleToUser() {
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
