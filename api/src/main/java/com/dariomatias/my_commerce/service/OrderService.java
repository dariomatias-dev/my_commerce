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
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import com.dariomatias.my_commerce.repository.contract.UserContract;
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
    private final StoreContract storeRepository;
    private final UserContract userRepository;
    private final ProductContract productRepository;
    private final UserAddressContract userAddressRepository;
    private final FreightService freightService;

    public OrderService(
            OrderContract orderRepository,
            StoreContract storeRepository,
            UserContract userRepository,
            ProductContract productRepository,
            UserAddressContract userAddressRepository,
            FreightService freightService
    ) {
        this.orderRepository = orderRepository;
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
        order.setAddress(snapshotAddress(userAddress));
        order.setPaymentMethod(request.getPaymentMethod());
        order.setFreightType(request.getFreightType());
        order.setStatus(Status.PENDING);
        order.setItems(new ArrayList<>());

        BigDecimal itemsAmount = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemRequest : request.getItems()) {
            Product product = getProductOrThrow(itemRequest.getProductId());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(product.getPrice());

            itemsAmount = itemsAmount.add(
                    product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()))
            );

            order.getItems().add(item);
        }

        FreightResponseDTO freight = freightService.calculateFreight(
                userAddress.getId()
        );

        if (request.getFreightType() == FreightType.ECONOMICAL) {
            order.setFreightAmount(freight.getEconomical().getValue());
        } else {
            order.setFreightAmount(freight.getEconomical().getValue());
        }

        order.setTotalAmount(itemsAmount.add(order.getFreightAmount()));

        return orderRepository.save(order);
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
        return orderRepository.countByStoreIdAndStatus(storeId, "COMPLETED");
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
                .filter(address -> address.getUser().getId().equals(user.getId()))
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço inválido"));
    }

    private OrderAddress snapshotAddress(UserAddress address) {
        OrderAddress snapshot = new OrderAddress();
        snapshot.setLabel(address.getLabel());
        snapshot.setStreet(address.getStreet());
        snapshot.setNumber(address.getNumber());
        snapshot.setComplement(address.getComplement());
        snapshot.setNeighborhood(address.getNeighborhood());
        snapshot.setCity(address.getCity());
        snapshot.setState(address.getState());
        snapshot.setZip(address.getZip());
        snapshot.setLocation(address.getLocation());
        return snapshot;
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
