package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    @Query(value = "SELECT add_item_to_order(:orderId, :productId, :quantity, :price)", nativeQuery = true)
    void addItemToOrder(
            @Param("orderId") UUID orderId,
            @Param("productId") UUID productId,
            @Param("quantity") Integer quantity,
            @Param("price") BigDecimal price
    );
}
