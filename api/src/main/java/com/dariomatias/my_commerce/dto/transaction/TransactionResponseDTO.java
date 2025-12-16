package com.dariomatias.my_commerce.dto.transaction;

import com.dariomatias.my_commerce.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionResponseDTO(UUID id, UUID orderId, String paymentMethod, BigDecimal amount, String status,
                                     LocalDateTime createdAt, LocalDateTime updatedAt) {

    public static TransactionResponseDTO from(Transaction transaction) {
        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getOrderId(),
                transaction.getPaymentMethod() != null ? transaction.getPaymentMethod().name() : null,
                transaction.getAmount(),
                transaction.getStatus() != null ? transaction.getStatus().name() : null,
                transaction.getAudit().getCreatedAt(),
                transaction.getAudit().getUpdatedAt()
        );
    }

}
