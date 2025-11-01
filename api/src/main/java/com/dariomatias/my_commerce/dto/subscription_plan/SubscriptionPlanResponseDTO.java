package com.dariomatias.my_commerce.dto.subscription_plan;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class SubscriptionPlanResponseDTO {

    private UUID id;
    private String name;
    private Integer maxStores;
    private Integer maxProducts;
    private String features;
    private BigDecimal price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SubscriptionPlanResponseDTO() {}

    public SubscriptionPlanResponseDTO(UUID id, String name, Integer maxStores, Integer maxProducts,
                                       String features, BigDecimal price, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.maxStores = maxStores;
        this.maxProducts = maxProducts;
        this.features = features;
        this.price = price;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static SubscriptionPlanResponseDTO from(SubscriptionPlan plan) {
        return new SubscriptionPlanResponseDTO(
                plan.getId(),
                plan.getName(),
                plan.getMaxStores(),
                plan.getMaxProducts(),
                plan.getFeatures(),
                plan.getPrice(),
                plan.getAudit().getCreatedAt(),
                plan.getAudit().getUpdatedAt()
        );
    }

    public UUID getId() { return id; }

    public String getName() { return name; }

    public Integer getMaxStores() { return maxStores; }

    public Integer getMaxProducts() { return maxProducts; }

    public String getFeatures() { return features; }

    public BigDecimal getPrice() { return price; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
