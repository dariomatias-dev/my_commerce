package com.dariomatias.my_commerce.dto.order;

import com.dariomatias.my_commerce.model.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class OrderResponseDTO {

    private UUID id;
    private UUID storeId;
    private UUID userId;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String shippingMethod;
    private BigDecimal shippingCost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponseDTO() {}

    public OrderResponseDTO(UUID id, UUID storeId, UUID userId, BigDecimal totalAmount, String status,
                            String shippingAddress, String shippingMethod, BigDecimal shippingCost,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.storeId = storeId;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.shippingMethod = shippingMethod;
        this.shippingCost = shippingCost;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static OrderResponseDTO from(Order order) {
        return new OrderResponseDTO(
                order.getId(),
                order.getStoreId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getShippingMethod(),
                order.getShippingCost(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getStoreId() { return storeId; }
    public void setStoreId(UUID storeId) { this.storeId = storeId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getShippingMethod() { return shippingMethod; }
    public void setShippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; }

    public BigDecimal getShippingCost() { return shippingCost; }
    public void setShippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
