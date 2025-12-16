package com.dariomatias.my_commerce.dto.order_item;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class OrderItemRequestDTO {

    @NotNull(message = "O produto é obrigatório")
    private UUID productId;

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade deve ser maior que zero")
    private Integer quantity;

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
