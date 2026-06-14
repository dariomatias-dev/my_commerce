package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("StoreService")
class StoreServiceTest {

    @Mock
    private StoreContract storeRepository;

    @Mock
    private ProductContract productRepository;

    @Mock
    private SubscriptionContract subscriptionRepository;

    @Mock
    private SubscriptionPlanContract subscriptionPlanRepository;

    @Mock
    private UserContract userRepository;

    @Mock
    private MinioService minioService;

    @InjectMocks
    private StoreService storeService;

    private User user;
    private UUID storeId;
    private StoreRequestDTO request;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setRole(UserRole.SUBSCRIBER);

        storeId = UUID.randomUUID();

        request = new StoreRequestDTO();
        request.setName("My Store");
        request.setDescription("Store description");
        request.setThemeColor("#FF5733");
        request.setIsActive(true);
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("no active subscription should throw 404")
        void noActiveSubscription_shouldThrow404() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.create(user, request, null, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verifyNoInteractions(storeRepository);
        }

        @Test
        @DisplayName("store limit reached should throw 422")
        void storeLimitReached_shouldThrowUnprocessable() {
            SubscriptionPlan plan = planWithMaxStores(2);
            Subscription subscription = subscriptionWithPlan(plan);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(storeRepository.countByUserIdAndDeletedAtIsNull(user.getId())).thenReturn(2L);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.create(user, request, null, null));

            assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
        }

        @Test
        @DisplayName("duplicate slug should throw 409")
        void duplicateSlug_shouldThrow409() {
            SubscriptionPlan plan = planWithMaxStores(-1);
            Subscription subscription = subscriptionWithPlan(plan);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            // SlugUtil.generateSlug("My Store") -> "my-store"
            when(storeRepository.existsBySlugAndDeletedAtIsNull("my-store")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.create(user, request, null, null));

            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        }

        @Test
        @DisplayName("with logo and banner should upload to MinIO")
        void withLogoAndBanner_shouldUploadToMinIO() {
            SubscriptionPlan plan = planWithMaxStores(-1);
            Subscription subscription = subscriptionWithPlan(plan);

            Store saved = new Store();
            saved.setId(storeId);

            MultipartFile logo = mock(MultipartFile.class);
            MultipartFile banner = mock(MultipartFile.class);
            when(logo.isEmpty()).thenReturn(false);
            when(banner.isEmpty()).thenReturn(false);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(storeRepository.existsBySlugAndDeletedAtIsNull("my-store")).thenReturn(false);
            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(storeRepository.save(any(Store.class))).thenReturn(saved);

            storeService.create(user, request, logo, banner);

            verify(minioService).createBucket("stores");
            verify(minioService).uploadFile("stores", "my-store/logo.jpeg", logo);
            verify(minioService).uploadFile("stores", "my-store/banner.jpeg", banner);
        }

        @Test
        @DisplayName("without images should not call uploadFile")
        void withoutImages_shouldNotUpload() {
            SubscriptionPlan plan = planWithMaxStores(-1);
            Subscription subscription = subscriptionWithPlan(plan);
            Store saved = new Store();
            saved.setId(storeId);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(storeRepository.existsBySlugAndDeletedAtIsNull("my-store")).thenReturn(false);
            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(storeRepository.save(any(Store.class))).thenReturn(saved);

            storeService.create(user, request, null, null);

            verify(minioService).createBucket("stores");
            verify(minioService, never()).uploadFile(any(), any(), any());
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        private Store existingStore;

        @BeforeEach
        void setUp() {
            existingStore = new Store();
            existingStore.setId(storeId);
            existingStore.setName("Old Name");
            existingStore.setSlug("old-name");
            existingStore.setUser(user);
        }

        @Test
        @DisplayName("name with existing slug should throw 409")
        void duplicateSlugOnUpdate_shouldThrow409() {
            request.setName("Other Store");

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(existingStore));
            // SlugUtil.generateSlug("Other Store") -> "other-store"
            when(storeRepository.existsBySlugAndDeletedAtIsNull("other-store")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.update(storeId, request, user, null, null));

            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
            verify(storeRepository, never()).update(any());
        }

        @Test
        @DisplayName("with logo and banner should upload to MinIO")
        void withLogoAndBanner_shouldUploadToMinIO() {
            MultipartFile logo = mock(MultipartFile.class);
            MultipartFile banner = mock(MultipartFile.class);
            when(logo.isEmpty()).thenReturn(false);
            when(banner.isEmpty()).thenReturn(false);

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(existingStore));
            when(storeRepository.update(existingStore)).thenReturn(existingStore);

            storeService.update(storeId, null, user, logo, banner);

            // existing slug is "old-name"
            verify(minioService).uploadFile("stores", "old-name/logo.jpeg", logo);
            verify(minioService).uploadFile("stores", "old-name/banner.jpeg", banner);
        }
    }

    @Nested
    @DisplayName("getBySlug")
    class GetBySlug {

        @Test
        @DisplayName("store not found should throw 404")
        void storeNotFound_shouldThrow404() {
            when(storeRepository.findBySlug("invalid-slug")).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.getBySlug("invalid-slug", null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("inactive store accessed by anonymous user should throw 404")
        void inactiveStoreForAnonymousUser_shouldThrow404() {
            Store inactiveStore = new Store();
            inactiveStore.setId(storeId);
            inactiveStore.setIsActive(false);
            inactiveStore.setUser(user);

            when(storeRepository.findBySlug("my-store")).thenReturn(Optional.of(inactiveStore));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.getBySlug("my-store", null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("active store should be returned to any user")
        void activeStore_shouldReturn() {
            Store activeStore = new Store();
            activeStore.setId(storeId);
            activeStore.setIsActive(true);
            activeStore.setUser(user);

            when(storeRepository.findBySlug("my-store")).thenReturn(Optional.of(activeStore));

            Store result = storeService.getBySlug("my-store", null);

            assertNotNull(result);
            assertEquals(storeId, result.getId());
        }
    }

    private SubscriptionPlan planWithMaxStores(int maxStores) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId(UUID.randomUUID());
        plan.setMaxStores(maxStores);
        return plan;
    }

    private Subscription subscriptionWithPlan(SubscriptionPlan plan) {
        Subscription subscription = new Subscription();
        subscription.setId(UUID.randomUUID());
        subscription.setPlan(plan);
        return subscription;
    }
}
