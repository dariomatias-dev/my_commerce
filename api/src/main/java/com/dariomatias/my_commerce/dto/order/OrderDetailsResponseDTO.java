package com.dariomatias.my_commerce.dto.order;

import com.dariomatias.my_commerce.dto.order_item.OrderItemResponseDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.Order;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderDetailsResponseDTO {

    private UUID id;
    private UUID storeId;
    private UUID userId;
    private UUID addressId;
    private PaymentMethod paymentMethod;
    private FreightType freightType;
    private BigDecimal freightAmount;
    private BigDecimal totalAmount;
    private Status status;
    private int itemsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponseDTO> items;

    public OrderDetailsResponseDTO(
            UUID id,
            UUID storeId,
            UUID userId,
            UUID addressId,
            PaymentMethod paymentMethod,
            FreightType freightType,
            BigDecimal freightAmount,
            BigDecimal totalAmount,
            Status status,
            int itemsCount,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<OrderItemResponseDTO> items
    ) {
        this.id = id;
        this.storeId = storeId;
        this.userId = userId;
        this.addressId = addressId;
        this.paymentMethod = paymentMethod;
        this.freightType = freightType;
        this.freightAmount = freightAmount;
        this.totalAmount = totalAmount;
        this.status = status;
        this.itemsCount = itemsCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = items;
    }

    public static OrderDetailsResponseDTO from(Order order) {
        List<OrderItemResponseDTO> items = order.getItems() != null
                ? order.getItems().stream()
                .map(OrderItemResponseDTO::from)
                .toList()
                : List.of();

        return new OrderDetailsResponseDTO(
                order.getId(),
                order.getStoreId(),
                order.getUserId(),
                order.getAddress() != null ? order.getAddress().getId() : null,
                order.getPaymentMethod(),
                order.getFreightType(),
                order.getFreightAmount(),
                order.getTotalAmount(),
                order.getStatus(),
                items.size(),
                order.getAudit().getCreatedAt(),
                order.getAudit().getUpdatedAt(),
                items
        );
    }
}
