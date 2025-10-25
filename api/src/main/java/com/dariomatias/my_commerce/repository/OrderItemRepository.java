package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    Page<OrderItem> findAllByOrder(Order order, Pageable pageable);

    Page<OrderItem> findAllByProduct(Product product, Pageable pageable);
}
