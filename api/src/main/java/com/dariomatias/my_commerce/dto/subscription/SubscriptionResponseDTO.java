package com.dariomatias.my_commerce.dto.subscription;

import com.dariomatias.my_commerce.model.Subscription;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubscriptionResponseDTO(UUID id, UUID userId, UUID planId, LocalDateTime startDate, LocalDateTime endDate,
                                      Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {

    public static SubscriptionResponseDTO from(Subscription subscription) {
        return new SubscriptionResponseDTO(
                subscription.getId(),
                subscription.getUserId(),
                subscription.getPlanId(),
                subscription.getStartDate(),
                subscription.getEndDate(),
                subscription.getIsActive(),
                subscription.getAudit().getCreatedAt(),
                subscription.getAudit().getUpdatedAt()
        );
    }

}
