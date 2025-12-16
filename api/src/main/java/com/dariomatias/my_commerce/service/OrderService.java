package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.dto.order_item.OrderItemRequestDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
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

    public OrderService(
            OrderContract orderRepository,
            StoreContract storeRepository,
            UserContract userRepository,
            ProductContract productRepository
    ) {
        this.orderRepository = orderRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Order create(User user, OrderRequestDTO request) {
        Order order = new Order();
        order.setStore(getStoreOrThrow(request.getStoreId()));
        order.setUser(getAuthenticatedUser(user));
        order.setStatus("PENDING");
        order.setTotalAmount(BigDecimal.ZERO);

        Order savedOrder = orderRepository.save(order);

        BigDecimal totalAmount = BigDecimal.ZERO;
        var items = new ArrayList<OrderItem>();

        for (OrderItemRequestDTO itemRequest : request.getItems()) {
            Product product = getProductOrThrow(itemRequest.getProductId());

            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(product.getPrice());

            totalAmount = totalAmount.add(
                    product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()))
            );

            items.add(item);
        }

        savedOrder.setTotalAmount(totalAmount);

        return orderRepository.save(savedOrder);
    }

    public Order getById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
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

    public Order updateStatus(UUID id, String status) {
        Order order = getById(id);
        order.setStatus(status);
        return orderRepository.update(order);
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
}
