package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface OrderItemContract {

    OrderItem save(OrderItem item);

    Optional<OrderItem> findById(UUID id);

    Page<OrderItem> findAll(Pageable pageable);

    Page<OrderItem> findAllByOrderId(UUID orderId, Pageable pageable);

    Page<OrderItem> findAllByProductId(UUID productId, Pageable pageable);

    OrderItem update(OrderItem item);

    void deleteById(UUID id);
}
