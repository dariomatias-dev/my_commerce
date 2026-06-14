package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.freight.FreightOptionDTO;
import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import com.dariomatias.my_commerce.dto.order.OrderDetailsResponseDTO;
import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.dto.order_item.OrderItemRequestDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.*;
import com.dariomatias.my_commerce.repository.contract.*;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService")
class OrderServiceTest {

    @Mock
    private OrderContract orderRepository;

    @Mock
    private OrderItemContract orderItemRepository;

    @Mock
    private OrderAddressContract orderAddressRepository;

    @Mock
    private StoreContract storeRepository;

    @Mock
    private UserContract userRepository;

    @Mock
    private ProductContract productRepository;

    @Mock
    private UserAddressContract userAddressRepository;

    @Mock
    private FreightService freightService;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private User adminUser;
    private UUID storeId;
    private UUID addressId;
    private UUID productId;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setRole(UserRole.USER);

        adminUser = new User();
        adminUser.setId(UUID.randomUUID());
        adminUser.setRole(UserRole.ADMIN);

        storeId = UUID.randomUUID();
        addressId = UUID.randomUUID();
        productId = UUID.randomUUID();
    }

    @Nested
    @DisplayName("create")
    class Create {

        private OrderRequestDTO request;

        @BeforeEach
        void setUp() {
            OrderItemRequestDTO item = new OrderItemRequestDTO();
            item.setProductId(productId);
            item.setQuantity(2);

            request = new OrderRequestDTO();
            request.setStoreId(storeId);
            request.setAddressId(addressId);
            request.setPaymentMethod(PaymentMethod.PIX);
            request.setFreightType(FreightType.ECONOMICAL);
            request.setItems(List.of(item));
        }

        @Test
        @DisplayName("empty item list should throw 400")
        void emptyItemList_shouldThrow400() {
            request.setItems(List.of());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.create(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verifyNoInteractions(orderRepository);
        }

        @Test
        @DisplayName("address belonging to another user should throw 400")
        void addressBelongingToOtherUser_shouldThrow400() {
            User otherUser = new User();
            otherUser.setId(UUID.randomUUID());

            UserAddress address = new UserAddress();
            address.setId(addressId);
            address.setUser(otherUser);

            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(address));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.create(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        @DisplayName("valid data should save order with status COMPLETED")
        void validData_shouldSaveWithStatusCompleted() {
            UserAddress userAddress = new UserAddress();
            userAddress.setId(addressId);
            userAddress.setUser(user);

            Store store = new Store();
            store.setId(storeId);

            OrderAddress savedOrderAddress = new OrderAddress();
            savedOrderAddress.setId(UUID.randomUUID());

            FreightOptionDTO economicOption = new FreightOptionDTO(new BigDecimal("1.50"), 5, FreightType.ECONOMICAL);
            FreightResponseDTO freight = new FreightResponseDTO(economicOption, mock(FreightOptionDTO.class));

            Order savedOrder = new Order();
            savedOrder.setId(UUID.randomUUID());
            savedOrder.setFreightAmount(new BigDecimal("1.50"));

            Product product = new Product();
            product.setId(productId);
            product.setPrice(new BigDecimal("10.00"));

            when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
            when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(userAddress));
            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(orderAddressRepository.save(any())).thenReturn(savedOrderAddress);
            when(freightService.calculateFreight(addressId)).thenReturn(freight);
            when(orderRepository.save(any())).thenReturn(savedOrder);
            when(productRepository.findById(productId)).thenReturn(Optional.of(product));
            when(orderRepository.update(any())).thenReturn(savedOrder);

            orderService.create(user, request);

            ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
            verify(orderRepository).save(captor.capture());
            assertEquals(Status.COMPLETED, captor.getValue().getStatus());
            verify(orderItemRepository).addItemToOrder(
                    eq(savedOrder.getId()), eq(productId), eq(2), eq(new BigDecimal("10.00"))
            );
        }
    }

    @Nested
    @DisplayName("getAll")
    class GetAll {

        @Test
        @DisplayName("should delegate to repository with pageable")
        void shouldDelegateToRepository() {
            Pageable pageable = Pageable.ofSize(10);
            @SuppressWarnings("unchecked")
            Page<Order> page = mock(Page.class);
            when(orderRepository.findAll(pageable)).thenReturn(page);

            Page<Order> result = orderService.getAll(pageable);

            assertEquals(page, result);
            verify(orderRepository).findAll(pageable);
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
            @SuppressWarnings("unchecked")
            Page<Order> page = mock(Page.class);
            when(orderRepository.findAllByUserId(userId, pageable)).thenReturn(page);

            Page<Order> result = orderService.getAllByUser(userId, pageable);

            assertEquals(page, result);
            verify(orderRepository).findAllByUserId(userId, pageable);
        }
    }

    @Nested
    @DisplayName("getAllByStore")
    class GetAllByStore {

        @Test
        @DisplayName("ADMIN should bypass store ownership check and return orders")
        void admin_shouldBypassOwnershipCheck() {
            Pageable pageable = Pageable.ofSize(10);
            @SuppressWarnings("unchecked")
            Page<Order> page = mock(Page.class);
            when(orderRepository.findAllByStoreId(storeId, pageable)).thenReturn(page);

            Page<Order> result = orderService.getAllByStore(storeId, adminUser, pageable);

            assertEquals(page, result);
            verifyNoInteractions(storeRepository);
        }

        @Test
        @DisplayName("USER with store not found should throw 404")
        void userStoreNotFound_shouldThrow404() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.getAllByStore(storeId, user, Pageable.unpaged()));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("USER not owner of store should throw 403")
        void userNotOwner_shouldThrow403() {
            Store store = new Store();
            store.setId(storeId);
            store.setUserId(UUID.randomUUID());

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.getAllByStore(storeId, user, Pageable.unpaged()));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("USER owner of store should return orders")
        void userOwner_shouldReturnOrders() {
            Store store = new Store();
            store.setId(storeId);
            store.setUserId(user.getId());

            Pageable pageable = Pageable.ofSize(10);
            @SuppressWarnings("unchecked")
            Page<Order> page = mock(Page.class);

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(orderRepository.findAllByStoreId(storeId, pageable)).thenReturn(page);

            Page<Order> result = orderService.getAllByStore(storeId, user, pageable);

            assertEquals(page, result);
        }
    }

    @Nested
    @DisplayName("getMyOrderStores")
    class GetMyOrderStores {

        @Test
        @DisplayName("should delegate to repository")
        void shouldDelegateToRepository() {
            UUID userId = UUID.randomUUID();
            Pageable pageable = Pageable.ofSize(10);
            @SuppressWarnings("unchecked")
            Page<Store> page = mock(Page.class);
            when(orderRepository.findStoresWithOrdersByUserId(userId, pageable)).thenReturn(page);

            Page<Store> result = orderService.getMyOrderStores(userId, pageable);

            assertEquals(page, result);
            verify(orderRepository).findStoresWithOrdersByUserId(userId, pageable);
        }
    }

    @Nested
    @DisplayName("getMyOrdersByStore")
    class GetMyOrdersByStore {

        @Test
        @DisplayName("should delegate to repository")
        void shouldDelegateToRepository() {
            UUID userId = UUID.randomUUID();
            Pageable pageable = Pageable.ofSize(10);
            @SuppressWarnings("unchecked")
            Page<Order> page = mock(Page.class);
            when(orderRepository.findAllByUserIdAndStoreId(userId, storeId, pageable)).thenReturn(page);

            Page<Order> result = orderService.getMyOrdersByStore(userId, storeId, pageable);

            assertEquals(page, result);
            verify(orderRepository).findAllByUserIdAndStoreId(userId, storeId, pageable);
        }
    }

    @Nested
    @DisplayName("getSuccessfulSalesCount")
    class GetSuccessfulSalesCount {

        @Test
        @DisplayName("ADMIN should bypass ownership check and return count")
        void admin_shouldBypassOwnershipCheck() {
            when(orderRepository.countByStoreIdAndStatus(storeId, Status.COMPLETED)).thenReturn(5L);

            long count = orderService.getSuccessfulSalesCount(storeId, adminUser);

            assertEquals(5L, count);
            verifyNoInteractions(storeRepository);
        }

        @Test
        @DisplayName("USER with store not found should throw 404")
        void userStoreNotFound_shouldThrow404() {
            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.getSuccessfulSalesCount(storeId, user));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("USER not owner of store should throw 403")
        void userNotOwner_shouldThrow403() {
            Store store = new Store();
            store.setId(storeId);
            store.setUserId(UUID.randomUUID());

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.getSuccessfulSalesCount(storeId, user));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("USER owner of store should return completed order count")
        void userOwner_shouldReturnCount() {
            Store store = new Store();
            store.setId(storeId);
            store.setUserId(user.getId());

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(orderRepository.countByStoreIdAndStatus(storeId, Status.COMPLETED)).thenReturn(3L);

            long count = orderService.getSuccessfulSalesCount(storeId, user);

            assertEquals(3L, count);
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("should delegate deleteById to repository")
        void shouldDelegateDeleteById() {
            UUID orderId = UUID.randomUUID();

            orderService.delete(orderId);

            verify(orderRepository).deleteById(orderId);
        }
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        private UUID orderId;

        @BeforeEach
        void setUp() {
            orderId = UUID.randomUUID();
        }

        @Test
        @DisplayName("order not found should throw 404")
        void orderNotFound_shouldThrow404() {
            when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.getById(orderId, user));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("non-owner user with USER role should throw 403")
        void nonOwnerWithUserRole_shouldThrow403() {
            User otherUser = new User();
            otherUser.setId(UUID.randomUUID());

            Order order = mock(Order.class);
            when(order.getUser()).thenReturn(otherUser);
            when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.getById(orderId, user));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        }

        @Test
        @DisplayName("owner should access order and receive DTO")
        void owner_shouldAccessAndReturnDTO() {
            Order order = mock(Order.class);
            when(order.getUser()).thenReturn(user);
            when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

            OrderDetailsResponseDTO mockDto = mock(OrderDetailsResponseDTO.class);

            try (MockedStatic<OrderDetailsResponseDTO> dtoStatic = mockStatic(OrderDetailsResponseDTO.class)) {
                dtoStatic.when(() -> OrderDetailsResponseDTO.from(order)).thenReturn(mockDto);

                OrderDetailsResponseDTO result = orderService.getById(orderId, user);

                assertNotNull(result);
                assertEquals(mockDto, result);
            }
        }

        @Test
        @DisplayName("ADMIN should access another user's order without 403")
        void admin_shouldAccessOtherUserOrderWithout403() {
            User otherUser = new User();
            otherUser.setId(UUID.randomUUID());

            Order order = mock(Order.class);
            when(order.getUser()).thenReturn(otherUser);
            when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

            OrderDetailsResponseDTO mockDto = mock(OrderDetailsResponseDTO.class);

            try (MockedStatic<OrderDetailsResponseDTO> dtoStatic = mockStatic(OrderDetailsResponseDTO.class)) {
                dtoStatic.when(() -> OrderDetailsResponseDTO.from(order)).thenReturn(mockDto);

                OrderDetailsResponseDTO result = orderService.getById(orderId, adminUser);

                assertNotNull(result);
            }
        }
    }
}
