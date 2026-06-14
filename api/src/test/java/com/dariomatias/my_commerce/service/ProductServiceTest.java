package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.product.ProductFilterDTO;
import com.dariomatias.my_commerce.dto.product.ProductRequestDTO;
import com.dariomatias.my_commerce.enums.StatusFilter;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.*;
import com.dariomatias.my_commerce.repository.contract.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService")
class ProductServiceTest {

    @Mock
    private ProductContract productRepository;

    @Mock
    private StoreContract storeRepository;

    @Mock
    private CategoryContract categoryRepository;

    @Mock
    private ProductImageService productImageService;

    @Mock
    private SubscriptionContract subscriptionRepository;

    @Mock
    private SubscriptionPlanContract subscriptionPlanRepository;

    @InjectMocks
    private ProductService productService;

    private User subscriberUser;
    private User adminUser;
    private UUID storeId;
    private UUID categoryId;
    private UUID productId;
    private Store store;
    private Category category;
    private ProductRequestDTO request;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        storeId = UUID.randomUUID();
        categoryId = UUID.randomUUID();
        productId = UUID.randomUUID();

        subscriberUser = new User();
        subscriberUser.setId(UUID.randomUUID());
        subscriberUser.setRole(UserRole.SUBSCRIBER);

        adminUser = new User();
        adminUser.setId(UUID.randomUUID());
        adminUser.setRole(UserRole.ADMIN);

        store = new Store();
        store.setId(storeId);
        store.setSlug("my-store");
        store.setUserId(subscriberUser.getId());

        category = new Category();
        category.setId(categoryId);
        category.setStoreId(storeId);

        request = new ProductRequestDTO();
        request.setStoreId(storeId);
        request.setCategoryId(categoryId);
        request.setName("Test Product");
        request.setDescription("Product description");
        request.setPrice(new BigDecimal("99.90"));
        request.setStock(10);
        request.setActive(true);

        pageable = PageRequest.of(0, 10);
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("store not found should throw 404")
        void storeNotFound_shouldThrow404() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.create(subscriberUser, request, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verifyNoInteractions(subscriptionRepository);
        }

        @Test
        @DisplayName("store belonging to another user should throw 403")
        void storeFromAnotherUser_shouldThrow403() {
            store.setUserId(UUID.randomUUID());
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.create(subscriberUser, request, null));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("no active subscription should throw 404")
        void noActiveSubscription_shouldThrow404() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(subscriptionRepository.findActiveByUserId(subscriberUser.getId()))
                    .thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.create(subscriberUser, request, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("plan product limit reached should throw 422")
        void planLimitReached_shouldThrow422() {
            SubscriptionPlan plan = planWithMaxProducts(5);
            Subscription subscription = subscriptionWithPlan(plan);

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(subscriptionRepository.findActiveByUserId(subscriberUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(productRepository.countByStoreUserIdAndDeletedAtIsNull(subscriberUser.getId()))
                    .thenReturn(5L);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.create(subscriberUser, request, null));

            assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
        }

        @Test
        @DisplayName("plan with unlimited products (-1) should not check count")
        void unlimitedPlan_shouldNotCheckCount() {
            SubscriptionPlan plan = planWithMaxProducts(-1);
            Subscription subscription = subscriptionWithPlan(plan);
            Product saved = buildProduct();

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(subscriptionRepository.findActiveByUserId(subscriberUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
            when(productRepository.findByStoreSlugAndProductSlug(anyString(), anyString()))
                    .thenReturn(Optional.empty());
            when(productRepository.save(any(Product.class))).thenReturn(saved);
            when(productRepository.update(any(Product.class))).thenReturn(saved);

            productService.create(subscriberUser, request, null);

            verify(productRepository, never()).countByStoreUserIdAndDeletedAtIsNull(any());
        }

        @Test
        @DisplayName("category not found should throw 404")
        void categoryNotFound_shouldThrow404() {
            SubscriptionPlan plan = planWithMaxProducts(-1);
            Subscription subscription = subscriptionWithPlan(plan);

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(subscriptionRepository.findActiveByUserId(subscriberUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.create(subscriberUser, request, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("category from different store should throw 400")
        void categoryFromDifferentStore_shouldThrow400() {
            SubscriptionPlan plan = planWithMaxProducts(-1);
            Subscription subscription = subscriptionWithPlan(plan);
            category.setStoreId(UUID.randomUUID());

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(subscriptionRepository.findActiveByUserId(subscriberUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.create(subscriberUser, request, null));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("duplicate slug in store should throw 409")
        void duplicateSlug_shouldThrow409() {
            SubscriptionPlan plan = planWithMaxProducts(-1);
            Subscription subscription = subscriptionWithPlan(plan);

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(subscriptionRepository.findActiveByUserId(subscriberUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
            when(productRepository.findByStoreSlugAndProductSlug(anyString(), anyString()))
                    .thenReturn(Optional.of(new Product()));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.create(subscriberUser, request, null));

            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid data should save product and call image upload")
        void validData_shouldSaveProductAndUpload() {
            SubscriptionPlan plan = planWithMaxProducts(-1);
            Subscription subscription = subscriptionWithPlan(plan);
            Product saved = buildProduct();

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(subscriptionRepository.findActiveByUserId(subscriberUser.getId()))
                    .thenReturn(Optional.of(subscription));
            when(subscriptionPlanRepository.findById(plan.getId())).thenReturn(Optional.of(plan));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
            when(productRepository.findByStoreSlugAndProductSlug(anyString(), anyString()))
                    .thenReturn(Optional.empty());
            when(productRepository.save(any(Product.class))).thenReturn(saved);
            when(productRepository.update(any(Product.class))).thenReturn(saved);

            Product result = productService.create(subscriberUser, request, null);

            assertNotNull(result);
            verify(productRepository).save(any(Product.class));
            verify(productImageService).upload(eq(store.getSlug()), any(Product.class), isNull());
            verify(productRepository).update(any(Product.class));
        }

        @Test
        @DisplayName("ADMIN should skip subscription check")
        void admin_shouldSkipSubscriptionCheck() {
            store.setUserId(adminUser.getId());
            Product saved = buildProduct();

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
            when(productRepository.findByStoreSlugAndProductSlug(anyString(), anyString()))
                    .thenReturn(Optional.empty());
            when(productRepository.save(any(Product.class))).thenReturn(saved);
            when(productRepository.update(any(Product.class))).thenReturn(saved);

            productService.create(adminUser, request, null);

            verifyNoInteractions(subscriptionRepository, subscriptionPlanRepository);
            verify(productRepository).save(any(Product.class));
        }
    }

    @Nested
    @DisplayName("getAllByStore")
    class GetAllByStore {

        @Test
        @DisplayName("null filter and null user should default to ACTIVE status without permission error")
        void nullFilterAndUser_shouldDefaultToActive() {
            Page<Product> page = new PageImpl<>(List.of());
            when(productRepository.findAll(any(ProductFilterDTO.class), eq(pageable))).thenReturn(page);

            Page<Product> result = productService.getAllByStore(null, null, pageable);

            assertNotNull(result);
        }

        @Test
        @DisplayName("status DELETED with USER role should throw 403")
        void statusDeletedWithUserRole_shouldThrow403() {
            User userRole = new User();
            userRole.setRole(UserRole.USER);

            ProductFilterDTO filter = new ProductFilterDTO();
            filter.setStoreId(storeId);
            filter.setStatus(StatusFilter.DELETED);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getAllByStore(userRole, filter, pageable));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("status ALL with null user should throw 403")
        void statusAllWithNullUser_shouldThrow403() {
            ProductFilterDTO filter = new ProductFilterDTO();
            filter.setStoreId(storeId);
            filter.setStatus(StatusFilter.ALL);

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getAllByStore(null, filter, pageable));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("status DELETED with ADMIN should return page")
        void statusDeletedWithAdmin_shouldReturnPage() {
            ProductFilterDTO filter = new ProductFilterDTO();
            filter.setStoreId(storeId);
            filter.setStatus(StatusFilter.DELETED);

            Page<Product> page = new PageImpl<>(List.of(buildProduct()));
            when(productRepository.findAll(any(ProductFilterDTO.class), eq(pageable))).thenReturn(page);

            Page<Product> result = productService.getAllByStore(adminUser, filter, pageable);

            assertEquals(1, result.getTotalElements());
        }

        @Test
        @DisplayName("status ACTIVE with null user should return page without error")
        void statusActiveWithNullUser_shouldReturnPage() {
            ProductFilterDTO filter = new ProductFilterDTO();
            filter.setStoreId(storeId);
            filter.setStatus(StatusFilter.ACTIVE);

            Page<Product> page = new PageImpl<>(List.of());
            when(productRepository.findAll(any(ProductFilterDTO.class), eq(pageable))).thenReturn(page);

            Page<Product> result = productService.getAllByStore(null, filter, pageable);

            assertNotNull(result);
        }
    }

    @Nested
    @DisplayName("getActiveProductsByStoreAndIds")
    class GetActiveProductsByStoreAndIds {

        @Test
        @DisplayName("store not found should throw 404")
        void storeNotFound_shouldThrow404() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getActiveProductsByStoreAndIds(storeId, List.of(productId), pageable));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("deleted store should throw 404")
        void deletedStore_shouldThrow404() {
            store.delete();
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getActiveProductsByStoreAndIds(storeId, List.of(productId), pageable));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("null product IDs should return Page.empty()")
        void nullProductIds_shouldReturnEmpty() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            Page<Product> result = productService.getActiveProductsByStoreAndIds(storeId, null, pageable);

            assertTrue(result.isEmpty());
            verify(productRepository, never()).findAllByStoreIdAndIdInAndDeletedAtIsNull(any(), any(), any());
        }

        @Test
        @DisplayName("empty product IDs should return Page.empty()")
        void emptyProductIds_shouldReturnEmpty() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            Page<Product> result = productService.getActiveProductsByStoreAndIds(storeId, List.of(), pageable);

            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("active store with valid IDs should return product page")
        void validData_shouldReturnPage() {
            List<UUID> ids = List.of(productId);
            Page<Product> page = new PageImpl<>(List.of(buildProduct()));

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(productRepository.findAllByStoreIdAndIdInAndDeletedAtIsNull(storeId, ids, pageable))
                    .thenReturn(page);

            Page<Product> result = productService.getActiveProductsByStoreAndIds(storeId, ids, pageable);

            assertEquals(1, result.getTotalElements());
        }
    }

    @Nested
    @DisplayName("getByStoreSlugAndProductSlug")
    class GetByStoreSlugAndProductSlug {

        @Test
        @DisplayName("store not found should throw 404")
        void storeNotFound_shouldThrow404() {
            when(storeRepository.findBySlug("invalid-slug")).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getByStoreSlugAndProductSlug("invalid-slug", "product"));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("product not found should throw 404")
        void productNotFound_shouldThrow404() {
            when(storeRepository.findBySlug("my-store")).thenReturn(Optional.of(store));
            when(productRepository.findByStoreSlugAndProductSlug("my-store", "missing-product"))
                    .thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getByStoreSlugAndProductSlug("my-store", "missing-product"));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid slugs should return product")
        void validSlugs_shouldReturnProduct() {
            Product product = buildProduct();
            when(storeRepository.findBySlug("my-store")).thenReturn(Optional.of(store));
            when(productRepository.findByStoreSlugAndProductSlug("my-store", "test-product"))
                    .thenReturn(Optional.of(product));

            Product result = productService.getByStoreSlugAndProductSlug("my-store", "test-product");

            assertNotNull(result);
            assertEquals(productId, result.getId());
        }
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        @Test
        @DisplayName("ADMIN: product not found should throw 404")
        void admin_productNotFound_shouldThrow404() {
            when(productRepository.findById(productId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getById(adminUser, productId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("ADMIN: should return deleted product")
        void admin_shouldReturnDeletedProduct() {
            Product deletedProduct = buildProduct();
            deletedProduct.delete();
            when(productRepository.findById(productId)).thenReturn(Optional.of(deletedProduct));

            Product result = productService.getById(adminUser, productId);

            assertNotNull(result);
            assertTrue(result.isDeleted());
        }

        @Test
        @DisplayName("null user: active product not found should throw 404")
        void nullUser_productNotFound_shouldThrow404() {
            when(productRepository.findByIdAndDeletedAtIsNull(productId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getById(null, productId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("USER: should only return active product")
        void user_shouldReturnOnlyActiveProduct() {
            User regularUser = new User();
            regularUser.setRole(UserRole.USER);
            Product product = buildProduct();
            when(productRepository.findByIdAndDeletedAtIsNull(productId)).thenReturn(Optional.of(product));

            Product result = productService.getById(regularUser, productId);

            assertNotNull(result);
            verify(productRepository).findByIdAndDeletedAtIsNull(productId);
            verify(productRepository, never()).findById(any());
        }
    }

    @Nested
    @DisplayName("getUserActiveProductsCount")
    class GetUserActiveProductsCount {

        @Test
        @DisplayName("should delegate count to repository")
        void shouldDelegateToRepository() {
            when(productRepository.countByStoreUserIdAndActiveTrueAndDeletedAtIsNull(subscriberUser.getId()))
                    .thenReturn(7L);

            long count = productService.getUserActiveProductsCount(subscriberUser);

            assertEquals(7L, count);
        }
    }

    @Nested
    @DisplayName("getActiveProductsCount")
    class GetActiveProductsCount {

        @Test
        @DisplayName("store not found should throw 404")
        void storeNotFound_shouldThrow404() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.getActiveProductsCount(storeId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("found store should return active product count")
        void foundStore_shouldReturnCount() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(productRepository.countByStoreIdAndActiveTrue(storeId)).thenReturn(12L);

            long count = productService.getActiveProductsCount(storeId);

            assertEquals(12L, count);
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        private Product existingProduct;

        @BeforeEach
        void setUp() {
            existingProduct = buildProduct();
            existingProduct.setStore(store);
            existingProduct.setCategory(category);
        }

        @Test
        @DisplayName("product not found (deleted) should throw 404")
        void productNotFound_shouldThrow404() {
            when(productRepository.findByIdAndDeletedAtIsNull(productId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.update(subscriberUser, productId, request, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("store not found should throw 404")
        void storeNotFound_shouldThrow404() {
            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(existingProduct));
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.update(subscriberUser, productId, request, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("user not owner of store should throw 403")
        void notOwner_shouldThrow403() {
            store.setUserId(UUID.randomUUID());
            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(existingProduct));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.update(subscriberUser, productId, request, null));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("category not found should throw 404")
        void categoryNotFound_shouldThrow404() {
            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(existingProduct));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.update(subscriberUser, productId, request, null));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("category from different store should throw 400")
        void categoryFromDifferentStore_shouldThrow400() {
            category.setStoreId(UUID.randomUUID());
            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(existingProduct));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.update(subscriberUser, productId, request, null));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("new name with duplicate slug should throw 409")
        void newNameWithDuplicateSlug_shouldThrow409() {
            existingProduct.setName("Old Name");
            existingProduct.setSlug("old-name");
            request.setName("Test Product");
            request.setCategoryId(null);

            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(existingProduct));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(productRepository.findByStoreSlugAndProductSlug(store.getSlug(), "test-product"))
                    .thenReturn(Optional.of(new Product()));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.update(subscriberUser, productId, request, null));

            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid name change should rename images and update product")
        void validNameChange_shouldRenameAndUpdate() {
            existingProduct.setName("Old Name");
            existingProduct.setSlug("old-name");
            existingProduct.setImages(new ArrayList<>());
            request.setName("New Name");
            request.setCategoryId(null);

            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(existingProduct));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(productRepository.findByStoreSlugAndProductSlug(store.getSlug(), "new-name"))
                    .thenReturn(Optional.empty());
            when(productRepository.update(existingProduct)).thenReturn(existingProduct);

            productService.update(subscriberUser, productId, request, null);

            verify(productImageService).rename(store.getSlug(), "old-name", "new-name");
            assertEquals("New Name", existingProduct.getName());
            assertEquals("new-name", existingProduct.getSlug());
        }

        @Test
        @DisplayName("null optional fields should not overwrite existing values")
        void nullOptionalFields_shouldNotOverwriteExisting() {
            existingProduct.setName("Existing Product");
            existingProduct.setSlug("existing-product");
            existingProduct.setDescription("Existing description");
            existingProduct.setPrice(new BigDecimal("50.00"));
            existingProduct.setStock(5);
            existingProduct.setActive(true);
            existingProduct.setImages(new ArrayList<>());

            ProductRequestDTO partialRequest = new ProductRequestDTO();
            partialRequest.setStoreId(storeId);
            partialRequest.setCategoryId(null);
            partialRequest.setName(null);
            partialRequest.setDescription(null);
            partialRequest.setPrice(null);
            partialRequest.setStock(null);
            partialRequest.setActive(null);

            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(existingProduct));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(productRepository.update(existingProduct)).thenReturn(existingProduct);

            productService.update(subscriberUser, productId, partialRequest, null);

            assertEquals("Existing Product", existingProduct.getName());
            assertEquals("Existing description", existingProduct.getDescription());
            assertEquals(new BigDecimal("50.00"), existingProduct.getPrice());
            assertEquals(5, existingProduct.getStock());
            assertTrue(existingProduct.getActive());
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("product not found should throw 404")
        void productNotFound_shouldThrow404() {
            when(productRepository.findByIdAndDeletedAtIsNull(productId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.delete(subscriberUser, productId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("store not found should throw 404")
        void storeNotFound_shouldThrow404() {
            Product product = buildProduct();
            product.setStore(store);

            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(product));
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.delete(subscriberUser, productId));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("user not owner should throw 403")
        void notOwner_shouldThrow403() {
            store.setUserId(UUID.randomUUID());
            Product product = buildProduct();
            product.setStore(store);

            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(product));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> productService.delete(subscriberUser, productId));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid deletion should remove images from MinIO and call repository delete")
        void validDeletion_shouldRemoveImagesAndDelete() {
            String imageUrl = "my-store/products/test-product/img.jpeg";
            ProductImage productImage = new ProductImage();
            productImage.setUrl(imageUrl);

            Product product = buildProduct();
            product.setStore(store);
            product.setImages(new ArrayList<>(List.of(productImage)));

            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(product));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            productService.delete(subscriberUser, productId);

            verify(productImageService).removeImages(eq(product), argThat(urls -> urls.contains(imageUrl)));
            verify(productRepository).delete(productId);
        }

        @Test
        @DisplayName("ADMIN can delete product from any store")
        void admin_canDeleteFromAnyStore() {
            store.setUserId(UUID.randomUUID());
            Product product = buildProduct();
            product.setStore(store);
            product.setImages(new ArrayList<>());

            when(productRepository.findByIdAndDeletedAtIsNull(productId))
                    .thenReturn(Optional.of(product));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            productService.delete(adminUser, productId);

            verify(productRepository).delete(productId);
        }
    }

    private Product buildProduct() {
        Product product = new Product();
        product.setId(productId);
        product.setName("Test Product");
        product.setSlug("test-product");
        product.setDescription("Product description");
        product.setPrice(new BigDecimal("99.90"));
        product.setStock(10);
        product.setActive(true);
        product.setImages(new ArrayList<>());
        return product;
    }

    private SubscriptionPlan planWithMaxProducts(int maxProducts) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId(UUID.randomUUID());
        plan.setMaxProducts(maxProducts);
        return plan;
    }

    private Subscription subscriptionWithPlan(SubscriptionPlan plan) {
        Subscription subscription = new Subscription();
        subscription.setId(UUID.randomUUID());
        subscription.setPlan(plan);
        return subscription;
    }
}
