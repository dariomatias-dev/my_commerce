package com.dariomatias.my_commerce.dto.subscription;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class SubscriptionRequestDTO {
    @NotNull(message = "O ID do plano é obrigatório")
    private UUID planId;

}
