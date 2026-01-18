package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface OrderItemContract {

    OrderItem save(OrderItem item);

    void addItemToOrder(UUID orderId, UUID productId, Integer quantity, BigDecimal price);

    Optional<OrderItem> findById(UUID id);

    Page<OrderItem> findAll(Pageable pageable);

    OrderItem update(OrderItem item);

    void deleteById(UUID id);
}
