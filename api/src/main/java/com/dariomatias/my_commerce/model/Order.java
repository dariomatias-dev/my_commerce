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
@Table(name = "orders")
public class Order {

    @Getter
    @Setter
    @Id
    @GeneratedValue
    private UUID id;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "store_id")
    private Store store;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Getter
    @Setter
    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Getter
    @Setter
    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @Getter
    @Setter
    @Column
    private String shippingAddress;

    @Getter
    @Setter
    @Column
    private String shippingMethod;

    @Getter
    @Setter
    @Column
    private BigDecimal shippingCost;

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
    private UUID storeId;

    @Setter
    @Transient
    private UUID userId;

    public Order() {}

    public UUID getStoreId() {
        return store != null ? store.getId() : storeId;
    }

    public UUID getUserId() {
        return user != null ? user.getId() : userId;
    }
}
