package com.dariomatias.my_commerce.dto.subscription_plan;

import com.dariomatias.my_commerce.model.SubscriptionPlan;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record SubscriptionPlanResponseDTO(UUID id, String name, Integer maxStores, Integer maxProducts, String features,
                                          BigDecimal price, LocalDateTime createdAt, LocalDateTime updatedAt) {

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

}
