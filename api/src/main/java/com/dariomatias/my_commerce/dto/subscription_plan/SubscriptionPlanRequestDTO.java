package com.dariomatias.my_commerce.dto.subscription_plan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SubscriptionPlanRequestDTO {

    @NotBlank
    private String name;

    @NotNull
    private Integer maxStores;

    @NotNull
    private Integer maxProducts;

    private String features;

    @NotNull
    private BigDecimal price;

}
