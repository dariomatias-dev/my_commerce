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
    private PaymentMethod paymentMethod;
    private FreightType freightType;
    private BigDecimal freightAmount;
    private BigDecimal totalAmount;
    private Status status;
    private OrderAddressResponseDTO orderAddress;
    private List<OrderItemResponseDTO> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderDetailsResponseDTO(
            UUID id,
            UUID storeId,
            UUID userId,
            PaymentMethod paymentMethod,
            FreightType freightType,
            BigDecimal freightAmount,
            BigDecimal totalAmount,
            Status status,
            OrderAddressResponseDTO orderAddress,
            List<OrderItemResponseDTO> items,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.userId = userId;
        this.paymentMethod = paymentMethod;
        this.freightType = freightType;
        this.freightAmount = freightAmount;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderAddress = orderAddress;
        this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
                order.getPaymentMethod(),
                order.getFreightType(),
                order.getFreightAmount(),
                order.getTotalAmount(),
                order.getStatus(),
                OrderAddressResponseDTO.from(order.getAddress()),
                items,
                order.getAudit().getCreatedAt(),
                order.getAudit().getUpdatedAt()
        );
    }
}
