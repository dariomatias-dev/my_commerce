package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.config.TestWebMvcConfig;
import com.dariomatias.my_commerce.dto.order.OrderDetailsResponseDTO;
import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.dto.order_item.OrderItemRequestDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import com.dariomatias.my_commerce.service.OrderService;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(OrderController.class)
@Import(TestWebMvcConfig.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private OrderService service;

    private UUID orderId;
    private UUID storeId;
    private UUID userId;
    private User mockUser;
    private Order order;
    private OrderRequestDTO orderRequest;

    @BeforeEach
    void setUp() {
        orderId = UUID.randomUUID();
        storeId = UUID.randomUUID();
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

        order = new Order();
        order.setId(orderId);
        order.setStoreId(storeId);
        order.setUserId(userId);
        order.setPaymentMethod(PaymentMethod.PIX);
        order.setFreightType(FreightType.ECONOMICAL);
        order.setFreightAmount(BigDecimal.TEN);
        order.setTotalAmount(BigDecimal.valueOf(60.0));
        order.setStatus(Status.PENDING);
        order.setItems(List.of());
        order.setAudit(audit);

        OrderItemRequestDTO item = new OrderItemRequestDTO();
        item.setProductId(UUID.randomUUID());
        item.setQuantity(2);

        orderRequest = new OrderRequestDTO();
        orderRequest.setStoreId(storeId);
        orderRequest.setAddressId(UUID.randomUUID());
        orderRequest.setPaymentMethod(PaymentMethod.PIX);
        orderRequest.setFreightType(FreightType.ECONOMICAL);
        orderRequest.setItems(List.of(item));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("POST /api/orders")
    class Create {

        @Test
        @DisplayName("should create order with valid payload")
        void shouldCreateOrder() throws Exception {
            when(service.create(nullable(User.class), any(OrderRequestDTO.class))).thenReturn(order);

            mockMvc.perform(post("/api/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(orderRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.paymentMethod").value("PIX"))
                    .andExpect(jsonPath("$.data.status").value("PENDING"));

            verify(service).create(nullable(User.class), any(OrderRequestDTO.class));
        }

        @Test
        @DisplayName("should return 400 when item list is empty")
        void shouldReturn400WhenNoItems() throws Exception {
            OrderRequestDTO requestWithNoItems = new OrderRequestDTO();
            requestWithNoItems.setStoreId(storeId);
            requestWithNoItems.setAddressId(UUID.randomUUID());
            requestWithNoItems.setPaymentMethod(PaymentMethod.PIX);
            requestWithNoItems.setFreightType(FreightType.ECONOMICAL);
            requestWithNoItems.setItems(List.of());

            mockMvc.perform(post("/api/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestWithNoItems)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"))
                    .andExpect(jsonPath("$.code").value(400));

            verifyNoInteractions(service);
        }

        @Test
        @DisplayName("should return 400 when storeId is missing")
        void shouldReturn400WhenStoreIdMissing() throws Exception {
            OrderRequestDTO requestWithNoStore = new OrderRequestDTO();
            requestWithNoStore.setAddressId(UUID.randomUUID());
            requestWithNoStore.setPaymentMethod(PaymentMethod.PIX);
            requestWithNoStore.setFreightType(FreightType.ECONOMICAL);
            requestWithNoStore.setItems(List.of(orderRequest.getItems().get(0)));

            mockMvc.perform(post("/api/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestWithNoStore)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value("error"));

            verifyNoInteractions(service);
        }
    }

    @Nested
    @DisplayName("GET /api/orders")
    class GetAll {

        @Test
        @DisplayName("should return order page")
        void shouldReturnOrderPage() throws Exception {
            Page<Order> page = new PageImpl<>(List.of(order));
            when(service.getAll(any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/orders")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].paymentMethod").value("PIX"))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(service).getAll(any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/orders/user/{userId}")
    class GetAllByUser {

        @Test
        @DisplayName("should return orders by user")
        void shouldReturnOrdersByUser() throws Exception {
            Page<Order> page = new PageImpl<>(List.of(order));
            when(service.getAllByUser(eq(userId), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/orders/user/{userId}", userId)
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(orderId.toString()));

            verify(service).getAllByUser(eq(userId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/orders/store/{storeId}")
    class GetAllByStore {

        @Test
        @DisplayName("should return store orders")
        void shouldReturnStoreOrders() throws Exception {
            Page<Order> page = new PageImpl<>(List.of(order));
            when(service.getAllByStore(eq(storeId), nullable(User.class), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/orders/store/{storeId}", storeId)
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].storeId").value(storeId.toString()));

            verify(service).getAllByStore(eq(storeId), nullable(User.class), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/orders/me")
    class GetMyOrders {

        @Test
        @DisplayName("should return authenticated user orders")
        void shouldReturnAuthenticatedUserOrders() throws Exception {
            Page<Order> page = new PageImpl<>(List.of(order));
            when(service.getAllByUser(eq(userId), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/orders/me")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(orderId.toString()));

            verify(service).getAllByUser(eq(userId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/orders/me/stores")
    class GetMyOrderStores {

        @Test
        @DisplayName("should return stores from authenticated user orders")
        void shouldReturnStoresFromMyOrders() throws Exception {
            AuditMetadata storeAudit = new AuditMetadata();
            storeAudit.setCreatedAt(LocalDateTime.now());
            storeAudit.setUpdatedAt(LocalDateTime.now());

            Store store = new Store();
            store.setId(storeId);
            store.setName("My Store");
            store.setUserId(userId);
            store.setAudit(storeAudit);

            Page<Store> storePage = new PageImpl<>(List.of(store));
            when(service.getMyOrderStores(eq(userId), any(Pageable.class))).thenReturn(storePage);

            mockMvc.perform(get("/api/orders/me/stores")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value(storeId.toString()));

            verify(service).getMyOrderStores(eq(userId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/orders/me/store/{storeId}")
    class GetMyOrdersByStore {

        @Test
        @DisplayName("should return authenticated user orders for store")
        void shouldReturnUserOrdersByStore() throws Exception {
            Page<Order> page = new PageImpl<>(List.of(order));
            when(service.getMyOrdersByStore(eq(userId), eq(storeId), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/orders/me/store/{storeId}", storeId)
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].storeId").value(storeId.toString()));

            verify(service).getMyOrdersByStore(eq(userId), eq(storeId), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/orders/{id}")
    class GetById {

        @Test
        @DisplayName("should return order details by ID")
        void shouldReturnOrderDetails() throws Exception {
            OrderDetailsResponseDTO details = new OrderDetailsResponseDTO(
                    orderId, null, userId, PaymentMethod.PIX, FreightType.ECONOMICAL,
                    BigDecimal.TEN, BigDecimal.valueOf(60.0), Status.PENDING, null,
                    List.of(), LocalDateTime.now(), LocalDateTime.now()
            );
            when(service.getById(eq(orderId), nullable(User.class))).thenReturn(details);

            mockMvc.perform(get("/api/orders/{id}", orderId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(orderId.toString()))
                    .andExpect(jsonPath("$.data.status").value("PENDING"));

            verify(service).getById(eq(orderId), nullable(User.class));
        }
    }

    @Nested
    @DisplayName("GET /api/orders/store/{storeId}/stats/successful-sales")
    class GetSuccessfulSalesCount {

        @Test
        @DisplayName("should return successful sales count")
        void shouldReturnSuccessfulSalesCount() throws Exception {
            when(service.getSuccessfulSalesCount(eq(storeId), nullable(User.class))).thenReturn(42L);

            mockMvc.perform(get("/api/orders/store/{storeId}/stats/successful-sales", storeId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data").value(42));

            verify(service).getSuccessfulSalesCount(eq(storeId), nullable(User.class));
        }
    }

    @Nested
    @DisplayName("DELETE /api/orders/{id}")
    class Delete {

        @Test
        @DisplayName("should delete order by ID")
        void shouldDeleteOrder() throws Exception {
            doNothing().when(service).delete(orderId);

            mockMvc.perform(delete("/api/orders/{id}", orderId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Pedido excluído com sucesso"));

            verify(service).delete(orderId);
        }
    }
}
