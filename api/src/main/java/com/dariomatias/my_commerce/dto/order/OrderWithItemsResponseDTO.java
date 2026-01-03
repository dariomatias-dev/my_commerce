package com.dariomatias.my_commerce.dto.order;

import com.dariomatias.my_commerce.dto.order_item.OrderItemResponseDTO;
import com.dariomatias.my_commerce.model.Order;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderWithItemsResponseDTO {

    private UUID id;
    private UUID storeId;
    private UUID userId;
    private BigDecimal totalAmount;
    private String status;
    private int itemsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponseDTO> items;

    public OrderWithItemsResponseDTO(
            UUID id,
            UUID storeId,
            UUID userId,
            BigDecimal totalAmount,
            String status,
            int itemsCount,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<OrderItemResponseDTO> items
    ) {
        this.id = id;
        this.storeId = storeId;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.itemsCount = itemsCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = items;
    }

    public static OrderWithItemsResponseDTO from(Order order) {
        var items = order.getItems() != null
                ? order.getItems().stream()
                .map(OrderItemResponseDTO::from)
                .toList()
                : List.<OrderItemResponseDTO>of();

        return new OrderWithItemsResponseDTO(
                order.getId(),
                order.getStoreId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getStatus(),
                items.size(),
                order.getAudit().getCreatedAt(),
                order.getAudit().getUpdatedAt(),
                items
        );
    }
}
