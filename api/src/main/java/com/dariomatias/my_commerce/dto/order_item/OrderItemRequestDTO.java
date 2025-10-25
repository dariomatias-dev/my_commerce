package com.dariomatias.my_commerce.dto.order_item;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class OrderItemRequestDTO {

    @NotNull(message = "O pedido é obrigatório")
    private UUID orderId;

    @NotNull(message = "O produto é obrigatório")
    private UUID productId;

    @NotNull(message = "A quantidade é obrigatória")
    private Integer quantity;

    @NotNull(message = "O preço é obrigatório")
    private BigDecimal price;

    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
