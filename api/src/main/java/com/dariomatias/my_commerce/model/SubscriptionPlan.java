package com.dariomatias.my_commerce.model;

import jakarta.persistence.*;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Setter
    @Id
    @GeneratedValue
    private UUID id;

    @Setter
    @Column(nullable = false, unique = true)
    private String name;

    @Setter
    @Column(nullable = false)
    private Integer maxStores;

    @Setter
    @Column(nullable = false)
    private Integer maxProducts;

    @Setter
    @Column(columnDefinition = "TEXT")
    private String features;

    @Setter
    @Column(nullable = false)
    private BigDecimal price;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public SubscriptionPlan() {}

    public UUID getId() { return id; }
    public String getName() { return name; }

    public Integer getMaxStores() { return maxStores; }
    public Integer getMaxProducts() { return maxProducts; }

    public String getFeatures() { return features; }
    public BigDecimal getPrice() { return price; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
