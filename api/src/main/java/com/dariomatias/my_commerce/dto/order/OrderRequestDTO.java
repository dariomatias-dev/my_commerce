package com.dariomatias.my_commerce.dto.order;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class OrderRequestDTO {

    @NotNull(message = "A loja é obrigatória")
    private UUID storeId;

    @NotNull(message = "O usuário é obrigatório")
    private UUID userId;

    @NotNull(message = "O total do pedido é obrigatório")
    private BigDecimal totalAmount;

    private String status;

    public UUID getStoreId() { return storeId; }
    public void setStoreId(UUID storeId) { this.storeId = storeId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
