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
        @DisplayName("lista de itens vazia deve lançar 400")
        void listaItensVazia_deveLancar400() {
            request.setItems(List.of());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.create(user, request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verifyNoInteractions(orderRepository);
        }

        @Test
        @DisplayName("endereço pertencente a outro usuário deve lançar 400")
        void enderecoDeOutroUsuario_deveLancar400() {
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
        @DisplayName("dados válidos deve salvar pedido com status COMPLETED")
        void dadosValidos_deveSalvarComStatusCompleted() {
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
    @DisplayName("getById")
    class GetById {

        private UUID orderId;

        @BeforeEach
        void setUp() {
            orderId = UUID.randomUUID();
        }

        @Test
        @DisplayName("pedido não encontrado deve lançar 404")
        void pedidoNaoEncontrado_deveLancar404() {
            when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> orderService.getById(orderId, user));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        @DisplayName("usuário não proprietário com role USER deve lançar 403")
        void naoProprietarioComRoleUser_deveLancar403() {
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
        @DisplayName("proprietário deve acessar o pedido e receber DTO")
        void proprietarioAcessa_deveRetornarDTO() {
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
        @DisplayName("ADMIN deve acessar pedido de outro usuário sem 403")
        void adminAcessaPedidoDeOutroUsuario_deveRetornarDTO() {
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
