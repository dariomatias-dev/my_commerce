package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.config.TestWebMvcConfig;
import com.dariomatias.my_commerce.dto.product.ProductIdsRequestDTO;
import com.dariomatias.my_commerce.dto.product.ProductRequestDTO;
import com.dariomatias.my_commerce.dto.product.ProductResponseDTO;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import com.dariomatias.my_commerce.service.ProductService;
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
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(ProductController.class)
@Import(TestWebMvcConfig.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService service;

    private UUID productId;
    private UUID storeId;
    private UUID categoryId;
    private UUID userId;
    private User mockUser;
    private Product product;
    private ProductRequestDTO productRequest;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        storeId = UUID.randomUUID();
        categoryId = UUID.randomUUID();
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

        product = new Product();
        product.setId(productId);
        product.setStoreId(storeId);
        product.setCategoryId(categoryId);
        product.setName("Test Product");
        product.setSlug("test-product");
        product.setDescription("Product description");
        product.setPrice(BigDecimal.valueOf(99.90));
        product.setStock(10);
        product.setActive(true);
        product.setImages(new ArrayList<>());
        product.setAudit(audit);

        productRequest = new ProductRequestDTO();
        productRequest.setStoreId(storeId);
        productRequest.setCategoryId(categoryId);
        productRequest.setName("Test Product");
        productRequest.setDescription("Product description");
        productRequest.setPrice(BigDecimal.valueOf(99.90));
        productRequest.setStock(10);
        productRequest.setActive(true);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("POST /api/products")
    class Create {

        @Test
        @DisplayName("should create product with multipart (data + images)")
        void shouldCreateProduct() throws Exception {
            when(service.create(any(User.class), any(ProductRequestDTO.class), any())).thenReturn(product);

            MockMultipartFile dataPart = new MockMultipartFile(
                    "data", "data", "application/json",
                    objectMapper.writeValueAsBytes(productRequest)
            );
            MockMultipartFile imagesPart = new MockMultipartFile(
                    "images", "img.jpg", "image/jpeg", "fake-image".getBytes()
            );

            mockMvc.perform(multipart("/api/products")
                            .file(dataPart)
                            .file(imagesPart))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(productId.toString()))
                    .andExpect(jsonPath("$.data.name").value("Test Product"));

            verify(service).create(any(User.class), any(ProductRequestDTO.class), any());
        }

        @Test
        @DisplayName("should return 400 when request data is invalid")
        void shouldReturn400WhenCreateRequestInvalid() throws Exception {
            MockMultipartFile invalidDataPart = new MockMultipartFile(
                    "data", "data", "application/json", "{}".getBytes()
            );
            MockMultipartFile imagesPart = new MockMultipartFile(
                    "images", "img.jpg", "image/jpeg", "fake-image".getBytes()
            );

            mockMvc.perform(multipart("/api/products")
                            .file(invalidDataPart)
                            .file(imagesPart))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("GET /api/products")
    class GetAll {

        @Test
        @DisplayName("should return product page with query params")
        void shouldReturnProductPage() throws Exception {
            Page<Product> page = new PageImpl<>(List.of(product));
            when(service.getAllByStore(nullable(User.class), any(), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/products")
                            .param("storeId", storeId.toString())
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(productId.toString()))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(service).getAllByStore(nullable(User.class), any(), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("POST /api/products/store/products-by-ids")
    class GetByIds {

        @Test
        @DisplayName("should return products by IDs")
        void shouldReturnProductsByIds() throws Exception {
            ProductIdsRequestDTO request = new ProductIdsRequestDTO();
            request.setStoreId(storeId);
            request.setProductIds(List.of(productId));

            Page<Product> page = new PageImpl<>(List.of(product));
            when(service.getActiveProductsByStoreAndIds(eq(storeId), anyList(), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(post("/api/products/store/products-by-ids")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request))
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(productId.toString()));

            verify(service).getActiveProductsByStoreAndIds(eq(storeId), anyList(), any(Pageable.class));
        }

        @Test
        @DisplayName("should return 400 when request is invalid")
        void shouldReturn400WhenGetByIdsRequestInvalid() throws Exception {
            mockMvc.perform(post("/api/products/store/products-by-ids")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("GET /api/products/store/{storeSlug}/product/{productSlug}")
    class GetBySlug {

        @Test
        @DisplayName("should return product by storeSlug and productSlug")
        void shouldReturnProductBySlug() throws Exception {
            when(service.getByStoreSlugAndProductSlug("test-store", "test-product")).thenReturn(product);

            mockMvc.perform(get("/api/products/store/{storeSlug}/product/{productSlug}",
                            "test-store", "test-product"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.slug").value("test-product"));

            verify(service).getByStoreSlugAndProductSlug("test-store", "test-product");
        }
    }

    @Nested
    @DisplayName("GET /api/products/{id}")
    class GetById {

        @Test
        @DisplayName("should return product by ID")
        void shouldReturnProductById() throws Exception {
            when(service.getById(nullable(User.class), eq(productId))).thenReturn(product);

            mockMvc.perform(get("/api/products/{id}", productId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(productId.toString()))
                    .andExpect(jsonPath("$.data.price").value(99.9));

            verify(service).getById(nullable(User.class), eq(productId));
        }
    }

    @Nested
    @DisplayName("GET /api/products/stores/stats/active-products")
    class GetUserActiveProductsCount {

        @Test
        @DisplayName("should return active product count for user")
        void shouldReturnUserActiveProductCount() throws Exception {
            when(service.getUserActiveProductsCount(any(User.class))).thenReturn(15L);

            mockMvc.perform(get("/api/products/stores/stats/active-products"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data").value(15));

            verify(service).getUserActiveProductsCount(any(User.class));
        }
    }

    @Nested
    @DisplayName("GET /api/products/store/{storeId}/stats/active-products")
    class GetActiveProductsCount {

        @Test
        @DisplayName("should return active product count in store")
        void shouldReturnActiveProductCountInStore() throws Exception {
            when(service.getActiveProductsCount(eq(storeId))).thenReturn(8L);

            mockMvc.perform(get("/api/products/store/{storeId}/stats/active-products", storeId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data").value(8));

            verify(service).getActiveProductsCount(storeId);
        }
    }

    @Nested
    @DisplayName("PATCH /api/products/{id}")
    class Update {

        @Test
        @DisplayName("should update product with optional multipart")
        void shouldUpdateProduct() throws Exception {
            product.setName("Updated Product");
            when(service.update(any(User.class), eq(productId), any(), any())).thenReturn(product);

            MockMultipartFile dataPart = new MockMultipartFile(
                    "data", "data", "application/json",
                    objectMapper.writeValueAsBytes(productRequest)
            );

            mockMvc.perform(multipart(HttpMethod.PATCH, "/api/products/{id}", productId)
                            .file(dataPart))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("Updated Product"));

            verify(service).update(any(User.class), eq(productId), any(), any());
        }

        @Test
        @DisplayName("should return 400 when request data is invalid")
        void shouldReturn400WhenUpdateRequestInvalid() throws Exception {
            MockMultipartFile invalidDataPart = new MockMultipartFile(
                    "data", "data", "application/json", "{}".getBytes()
            );

            mockMvc.perform(multipart(HttpMethod.PATCH, "/api/products/{id}", productId)
                            .file(invalidDataPart))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("DELETE /api/products/{id}")
    class Delete {

        @Test
        @DisplayName("should delete product by ID")
        void shouldDeleteProduct() throws Exception {
            doNothing().when(service).delete(any(User.class), eq(productId));

            mockMvc.perform(delete("/api/products/{id}", productId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Produto excluído com sucesso"));

            verify(service).delete(any(User.class), eq(productId));
        }
    }
}
