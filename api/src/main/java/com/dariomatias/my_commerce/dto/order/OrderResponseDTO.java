package com.dariomatias.my_commerce.dto.order;

import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.Order;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class OrderResponseDTO {

    private UUID id;
    private UUID storeId;
    private UUID userId;
    private UUID addressId;
    private PaymentMethod paymentMethod;
    private FreightType freightType;
    private BigDecimal totalAmount;
    private Status status;
    private int itemsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponseDTO(
            UUID id,
            UUID storeId,
            UUID userId,
            UUID addressId,
            PaymentMethod paymentMethod,
            FreightType freightType,
            BigDecimal totalAmount,
            Status status,
            int itemsCount,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.userId = userId;
        this.addressId = addressId;
        this.paymentMethod = paymentMethod;
        this.freightType = freightType;
        this.totalAmount = totalAmount;
        this.status = status;
        this.itemsCount = itemsCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static OrderResponseDTO from(Order order) {
        return new OrderResponseDTO(
                order.getId(),
                order.getStoreId(),
                order.getUserId(),
                order.getAddress() != null ? order.getAddress().getId() : null,
                order.getPaymentMethod(),
                order.getFreightType(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getItems() != null ? order.getItems().size() : 0,
                order.getAudit().getCreatedAt(),
                order.getAudit().getUpdatedAt()
        );
    }
}
