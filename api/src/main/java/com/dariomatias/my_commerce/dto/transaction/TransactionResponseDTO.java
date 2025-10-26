package com.dariomatias.my_commerce.dto.transaction;

import com.dariomatias.my_commerce.model.Transaction;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionResponseDTO {

    private UUID id;
    private UUID orderId;
    private String paymentMethod;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TransactionResponseDTO() {}

    public TransactionResponseDTO(UUID id, UUID orderId, String paymentMethod, BigDecimal amount,
                                  String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TransactionResponseDTO from(Transaction transaction) {
        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getOrderId(),
                transaction.getPaymentMethod(),
                transaction.getAmount(),
                transaction.getStatus(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }

    public UUID getId() { return id; }

    public UUID getOrderId() { return orderId; }

    public String getPaymentMethod() { return paymentMethod; }

    public BigDecimal getAmount() { return amount; }

    public String getStatus() { return status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
