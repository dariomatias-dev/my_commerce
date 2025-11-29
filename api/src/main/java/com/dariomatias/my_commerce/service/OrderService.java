package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
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

    private final OrderContract orderRepository;
    private final StoreContract storeRepository;
    private final UserContract userRepository;

    public OrderService(OrderContract orderRepository,
                        StoreContract storeRepository,
                        UserContract userRepository) {
        this.orderRepository = orderRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    public Order create(OrderRequestDTO request) {
        Order order = new Order();
        order.setStore(getStoreOrThrow(request.getStoreId()));
        order.setUser(getUserOrThrow(request.getUserId()));
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        return orderRepository.save(order);
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

    private Store getStoreOrThrow(UUID storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja não encontrada"));
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public Order update(UUID id, OrderRequestDTO request) {
        Order order = getById(id);

        if (request.getStoreId() != null)
            order.setStore(getStoreOrThrow(request.getStoreId()));

        if (request.getUserId() != null)
            order.setUser(getUserOrThrow(request.getUserId()));

        if (request.getTotalAmount() != null)
            order.setTotalAmount(request.getTotalAmount());

        if (request.getStatus() != null)
            order.setStatus(request.getStatus());

        return orderRepository.update(order);
    }

    public void delete(UUID id) {
        orderRepository.deleteById(id);
    }

}
