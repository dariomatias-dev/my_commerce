package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
    @Embedded
    private AuditMetadata audit = new AuditMetadata();

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
