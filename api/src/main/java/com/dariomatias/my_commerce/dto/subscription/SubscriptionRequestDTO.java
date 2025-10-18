package com.dariomatias.my_commerce.dto.subscription;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import java.util.UUID;
import java.time.LocalDateTime;

public class SubscriptionRequestDTO {

    @NotNull(message = "O ID do usuário é obrigatório")
    private UUID userId;

    @NotNull(message = "O ID do plano é obrigatório")
    private UUID planId;

    @NotNull(message = "A data de início é obrigatória")
    @FutureOrPresent(message = "A data de início deve ser presente ou futura")
    private LocalDateTime startDate;

    @NotNull(message = "A data de término é obrigatória")
    @FutureOrPresent(message = "A data de término deve ser presente ou futura")
    private LocalDateTime endDate;

    @NotNull(message = "O status ativo é obrigatório")
    private Boolean isActive;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
