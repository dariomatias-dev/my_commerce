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

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    @Getter
    @Setter
    private Order order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    @Getter
    @Setter
    private Product product;

    @Column(nullable = false)
    @Getter
    @Setter
    private Integer quantity;

    @Column(nullable = false)
    @Getter
    @Setter
    private BigDecimal price;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Transient
    @Setter
    private UUID orderId;

    @Transient
    @Setter
    private UUID productId;

    public OrderItem() {}

    public UUID getOrderId() {
        return order != null ? order.getId() : orderId;
    }

    public UUID getProductId() {
        return product != null ? product.getId() : productId;
    }
}
