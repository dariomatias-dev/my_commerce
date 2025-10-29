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
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false)
    private Integer maxStores;

    @Getter
    @Setter
    @Column(nullable = false)
    private Integer maxProducts;

    @Getter
    @Setter
    @Column(columnDefinition = "TEXT")
    private String features;

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

    public SubscriptionPlan() {}
}
