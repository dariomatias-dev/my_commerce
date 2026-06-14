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
        request.setName("Minha Loja");
        request.setDescription("Descrição da loja");
        request.setThemeColor("#FF5733");
        request.setIsActive(true);
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("sem assinatura ativa deve lançar 404")
        void semAssinaturaAtiva_deveLancar404() {
            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.create(user, request, null, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verifyNoInteractions(storeRepository);
        }

        @Test
        @DisplayName("limite de lojas do plano atingido deve lançar 422")
        void limiteDeLojaAtingido_deveLancarUnprocessable() {
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
        @DisplayName("slug duplicado deve lançar 409")
        void slugDuplicado_deveLancar409() {
            SubscriptionPlan plan = planWithMaxStores(-1);
            Subscription subscription = subscriptionWithPlan(plan);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            // SlugUtil.generateSlug("Minha Loja") → "minha-loja"
            when(storeRepository.existsBySlugAndDeletedAtIsNull("minha-loja")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.create(user, request, null, null));

            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        }

        @Test
        @DisplayName("com logo e banner deve realizar upload no MinIO")
        void comLogoEBanner_deveUploadParaMinIO() {
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
            when(storeRepository.existsBySlugAndDeletedAtIsNull("minha-loja")).thenReturn(false);
            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(storeRepository.save(any(Store.class))).thenReturn(saved);

            storeService.create(user, request, logo, banner);

            verify(minioService).createBucket("stores");
            verify(minioService).uploadFile("stores", "minha-loja/logo.jpeg", logo);
            verify(minioService).uploadFile("stores", "minha-loja/banner.jpeg", banner);
        }

        @Test
        @DisplayName("sem imagens não deve chamar uploadFile")
        void semImagens_naoDeveUpload() {
            SubscriptionPlan plan = planWithMaxStores(-1);
            Subscription subscription = subscriptionWithPlan(plan);
            Store saved = new Store();
            saved.setId(storeId);

            when(subscriptionRepository.findActiveByUserId(user.getId())).thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(storeRepository.existsBySlugAndDeletedAtIsNull("minha-loja")).thenReturn(false);
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
            existingStore.setName("Nome Antigo");
            existingStore.setSlug("nome-antigo");
            existingStore.setUser(user);
        }

        @Test
        @DisplayName("nome com slug já existente deve lançar 409")
        void slugDuplicadoNoUpdate_deveLancar409() {
            request.setName("Outra Loja");

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(existingStore));
            // SlugUtil.generateSlug("Outra Loja") → "outra-loja"
            when(storeRepository.existsBySlugAndDeletedAtIsNull("outra-loja")).thenReturn(true);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.update(storeId, request, user, null, null));

            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
            verify(storeRepository, never()).update(any());
        }

        @Test
        @DisplayName("com logo e banner deve realizar upload no MinIO")
        void comLogoEBanner_deveUploadParaMinIO() {
            MultipartFile logo = mock(MultipartFile.class);
            MultipartFile banner = mock(MultipartFile.class);
            when(logo.isEmpty()).thenReturn(false);
            when(banner.isEmpty()).thenReturn(false);

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(existingStore));
            when(storeRepository.update(existingStore)).thenReturn(existingStore);

            storeService.update(storeId, null, user, logo, banner);

            // existing slug is "nome-antigo"
            verify(minioService).uploadFile("stores", "nome-antigo/logo.jpeg", logo);
            verify(minioService).uploadFile("stores", "nome-antigo/banner.jpeg", banner);
        }
    }

    @Nested
    @DisplayName("getBySlug")
    class GetBySlug {

        @Test
        @DisplayName("loja não encontrada deve lançar 404")
        void lojaNaoEncontrada_deveLancar404() {
            when(storeRepository.findBySlug("slug-invalido")).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.getBySlug("slug-invalido", null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("loja inativa acessada por usuário anônimo deve lançar 404")
        void lojaInativaParaAnonimo_deveLancar404() {
            Store inactiveStore = new Store();
            inactiveStore.setId(storeId);
            inactiveStore.setIsActive(false);
            inactiveStore.setUser(user);

            when(storeRepository.findBySlug("minha-loja")).thenReturn(Optional.of(inactiveStore));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> storeService.getBySlug("minha-loja", null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("loja ativa deve retornar para qualquer usuário")
        void lojaAtiva_deveRetornar() {
            Store activeStore = new Store();
            activeStore.setId(storeId);
            activeStore.setIsActive(true);
            activeStore.setUser(user);

            when(storeRepository.findBySlug("minha-loja")).thenReturn(Optional.of(activeStore));

            Store result = storeService.getBySlug("minha-loja", null);

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
