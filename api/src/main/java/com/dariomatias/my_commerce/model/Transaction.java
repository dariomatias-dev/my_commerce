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
@Table(name = "transactions")
public class Transaction {

    @Getter
    @Setter
    @Id
    @GeneratedValue(generator = "UUID")
    @org.hibernate.annotations.GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @Getter
    @Setter
    @Column(nullable = false, length = 50)
    private String paymentMethod;

    @Getter
    @Setter
    @Column(nullable = false)
    private BigDecimal amount;

    @Getter
    @Setter
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

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

    public Transaction() {}

    public UUID getOrderId() {
        return order != null ? order.getId() : orderId;
    }
}
