package com.dariomatias.my_commerce.dto.subscription;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class SubscriptionRequestDTO {
    @NotNull(message = "O ID do plano é obrigatório")
    private UUID planId;

    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }
}
