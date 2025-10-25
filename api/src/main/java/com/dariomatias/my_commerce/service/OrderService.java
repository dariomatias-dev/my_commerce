package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.OrderAdapter;
import com.dariomatias.my_commerce.repository.adapter.StoreAdapter;
import com.dariomatias.my_commerce.repository.adapter.UserAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@Transactional
public class OrderService {

    private final OrderAdapter orderAdapter;
    private final StoreAdapter storeAdapter;
    private final UserAdapter userAdapter;

    public OrderService(OrderAdapter orderAdapter,
                        StoreAdapter storeAdapter,
                        UserAdapter userAdapter) {
        this.orderAdapter = orderAdapter;
        this.storeAdapter = storeAdapter;
        this.userAdapter = userAdapter;
    }

    public Order create(OrderRequestDTO request) {
        Store store = storeAdapter.findById(request.getStoreId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
        User user = userAdapter.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Order order = new Order();
        order.setStore(store);
        order.setUser(user);
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingMethod(request.getShippingMethod());
        order.setShippingCost(request.getShippingCost());

        return orderAdapter.save(order);
    }

    public Order getById(UUID id) {
        return orderAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    public Page<Order> getAll(Pageable pageable) {
        return orderAdapter.findAll(pageable);
    }

    public Page<Order> getAllByUser(UUID userId, Pageable pageable) {
        User user = userAdapter.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return orderAdapter.findAllByUser(user, pageable);
    }

    public Page<Order> getAllByStore(UUID storeId, Pageable pageable) {
        Store store = storeAdapter.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
        return orderAdapter.findAllByStore(store, pageable);
    }

    public Order update(UUID id, UUID storeId, UUID userId, BigDecimal totalAmount,
                        String status, String shippingAddress,
                        String shippingMethod, BigDecimal shippingCost) {
        Order order = getById(id);

        if (storeId != null) {
            Store store = storeAdapter.findById(storeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
            order.setStore(store);
        }

        if (userId != null) {
            User user = userAdapter.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
            order.setUser(user);
        }

        if (totalAmount != null) order.setTotalAmount(totalAmount);
        if (status != null) order.setStatus(status);
        if (shippingAddress != null) order.setShippingAddress(shippingAddress);
        if (shippingMethod != null) order.setShippingMethod(shippingMethod);
        if (shippingCost != null) order.setShippingCost(shippingCost);

        return orderAdapter.update(order);
    }

    public void delete(UUID id) {
        orderAdapter.delete(id);
    }
}
