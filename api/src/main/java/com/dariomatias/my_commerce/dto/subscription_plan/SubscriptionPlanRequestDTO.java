package com.dariomatias.my_commerce.dto.subscription_plan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getMaxStores() { return maxStores; }
    public void setMaxStores(Integer maxStores) { this.maxStores = maxStores; }

    public Integer getMaxProducts() { return maxProducts; }
    public void setMaxProducts(Integer maxProducts) { this.maxProducts = maxProducts; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
