package com.dariomatias.my_commerce.dto.subscription;

import com.dariomatias.my_commerce.model.Subscription;
import java.time.LocalDateTime;
import java.util.UUID;

public class SubscriptionResponseDTO {

    private UUID id;
    private UUID userId;
    private UUID planId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SubscriptionResponseDTO() {}

    public SubscriptionResponseDTO(UUID id, UUID userId, UUID planId, LocalDateTime startDate,
                                   LocalDateTime endDate, Boolean isActive, LocalDateTime createdAt,
                                   LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.planId = planId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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

    public UUID getId() { return id; }

    public UUID getUserId() { return userId; }

    public UUID getPlanId() { return planId; }

    public LocalDateTime getStartDate() { return startDate; }

    public LocalDateTime getEndDate() { return endDate; }

    public Boolean getIsActive() { return isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
