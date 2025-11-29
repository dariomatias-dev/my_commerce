package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.OrderAdapter;
import com.dariomatias.my_commerce.repository.adapter.StoreAdapter;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@Transactional
public class OrderService {

    private final OrderAdapter orderAdapter;
    private final StoreAdapter storeAdapter;
    private final UserContract userRepository;

    public OrderService(OrderAdapter orderAdapter,
                        StoreAdapter storeAdapter,
                        UserContract userRepository) {
        this.orderAdapter = orderAdapter;
        this.storeAdapter = storeAdapter;
        this.userRepository = userRepository;
    }

    public Order create(OrderRequestDTO request) {
        Order order = new Order();
        order.setStore(getStoreOrThrow(request.getStoreId()));
        order.setUser(getUserOrThrow(request.getUserId()));
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
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
        return orderAdapter.findAllByUser(getUserOrThrow(userId), pageable);
    }

    public Page<Order> getAllByStore(UUID storeId, Pageable pageable) {
        return orderAdapter.findAllByStore(getStoreOrThrow(storeId), pageable);
    }

    public Order update(UUID id, OrderRequestDTO request) {
        Order order = getById(id);
        if (request.getStoreId() != null) order.setStore(getStoreOrThrow(request.getStoreId()));
        if (request.getUserId() != null) order.setUser(getUserOrThrow(request.getUserId()));
        if (request.getTotalAmount() != null) order.setTotalAmount(request.getTotalAmount());
        if (request.getStatus() != null) order.setStatus(request.getStatus());
        return orderAdapter.update(order);
    }

    public void delete(UUID id) {
        orderAdapter.delete(id);
    }

    private Store getStoreOrThrow(UUID storeId) {
        return storeAdapter.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
}
