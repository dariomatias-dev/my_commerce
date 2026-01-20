package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.dto.order.OrderDetailsResponseDTO;
import com.dariomatias.my_commerce.dto.order_item.OrderItemRequestDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderAddress;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.OrderAddressRepository;
import com.dariomatias.my_commerce.repository.contract.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.UUID;

@Service
@Transactional
public class OrderService {

    private final OrderContract orderRepository;
    private final OrderItemContract orderItemRepository;
    private final OrderAddressContract orderAddressRepository;
    private final StoreContract storeRepository;
    private final UserContract userRepository;
    private final ProductContract productRepository;
    private final UserAddressContract userAddressRepository;
    private final FreightService freightService;

    public OrderService(
            OrderContract orderRepository,
            OrderItemContract orderItemRepository,
            OrderAddressContract orderAddressRepository,
            StoreContract storeRepository,
            UserContract userRepository,
            ProductContract productRepository,
            UserAddressContract userAddressRepository,
            FreightService freightService
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderAddressRepository = orderAddressRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.userAddressRepository = userAddressRepository;
        this.freightService = freightService;
    }

    public Order create(User user, OrderRequestDTO request) {
        User authenticatedUser = getAuthenticatedUser(user);
        UserAddress userAddress = getUserAddressOrThrow(request.getAddressId(), authenticatedUser);

        Order order = new Order();
        order.setStore(getStoreOrThrow(request.getStoreId()));
        order.setUser(authenticatedUser);

        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setLabel(userAddress.getLabel());
        orderAddress.setStreet(userAddress.getStreet());
        orderAddress.setNumber(userAddress.getNumber());
        orderAddress.setComplement(userAddress.getComplement());
        orderAddress.setNeighborhood(userAddress.getNeighborhood());
        orderAddress.setCity(userAddress.getCity());
        orderAddress.setState(userAddress.getState());
        orderAddress.setZip(userAddress.getZip());
        orderAddress.setLocation(userAddress.getLocation());

        orderAddress = orderAddressRepository.save(orderAddress);
        order.setAddress(orderAddress);

        order.setPaymentMethod(request.getPaymentMethod());
        order.setFreightType(request.getFreightType());
        order.setStatus(Status.COMPLETED);

        FreightResponseDTO freight = freightService.calculateFreight(userAddress.getId());

        switch (request.getFreightType()) {
            case ECONOMICAL -> order.setFreightAmount(freight.getEconomical().getValue());
            case EXPRESS -> order.setFreightAmount(freight.getExpress().getValue());
        }

        order.setTotalAmount(order.getFreightAmount());

        order = orderRepository.save(order);

        BigDecimal itemsAmount = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemRequest : request.getItems()) {
            Product product = getProductOrThrow(itemRequest.getProductId());

            orderItemRepository.addItemToOrder(
                    order.getId(),
                    product.getId(),
                    itemRequest.getQuantity(),
                    product.getPrice()
            );

            itemsAmount = itemsAmount.add(
                    product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()))
            );
        }

        order.setTotalAmount(order.getFreightAmount().add(itemsAmount));

        return orderRepository.update(order);
    }

    public Page<Order> getAll(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> getAllByUser(UUID userId, Pageable pageable) {
        return orderRepository.findAllByUserId(userId, pageable);
    }

    public Page<Order> getAllByStore(UUID storeId, Pageable pageable) {
        return orderRepository.findAllByStoreId(storeId, pageable);
    }

    public Page<Store> getMyOrderStores(UUID userId, Pageable pageable) {
        return orderRepository.findStoresWithOrdersByUserId(userId, pageable);
    }

    public Page<Order> getMyOrdersByStore(UUID userId, UUID storeId, Pageable pageable) {
        return orderRepository.findAllByUserIdAndStoreId(userId, storeId, pageable);
    }

    public OrderDetailsResponseDTO getById(UUID orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Pedido não encontrado"
                        )
                );

        validateOrderAccess(order, user);

        return OrderDetailsResponseDTO.from(order);
    }

    public long getSuccessfulSalesCount(UUID storeId) {
        return orderRepository.countByStoreIdAndStatus(storeId, Status.COMPLETED);
    }

    public void delete(UUID id) {
        orderRepository.deleteById(id);
    }

    private Store getStoreOrThrow(UUID storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    private User getAuthenticatedUser(User user) {
        return userRepository.findById(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado"));
    }

    private Product getProductOrThrow(UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    private UserAddress getUserAddressOrThrow(UUID addressId, User user) {
        return userAddressRepository.findById(addressId)
                .filter(address -> !address.isDeleted())
                .filter(address -> address.getUserId().equals(user.getId()))
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço inválido"));
    }


    private void validateOrderAccess(Order order, User authenticatedUser) {
        boolean isAdmin = authenticatedUser.getRole() == UserRole.ADMIN;
        boolean isOwner = order.getUser().getId().equals(authenticatedUser.getId());

        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Você não tem permissão para acessar este pedido"
            );
        }
    }
}
