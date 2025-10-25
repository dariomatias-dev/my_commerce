package com.dariomatias.my_commerce.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Getter
    @Setter
    @Id
    @GeneratedValue
    private UUID id;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Getter
    @Setter
    @Column(nullable = false)
    private Integer quantity;

    @Getter
    @Setter
    @Column(nullable = false)
    private BigDecimal price;

    @Getter
    @Setter
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Setter
    @Transient
    private UUID orderId;

    @Setter
    @Transient
    private UUID productId;

    public OrderItem() {}

    public UUID getOrderId() {
        return order != null ? order.getId() : orderId;
    }

    public UUID getProductId() {
        return product != null ? product.getId() : productId;
    }
}
