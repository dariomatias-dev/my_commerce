package com.dariomatias.my_commerce.dto.transaction;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class TransactionRequestDTO {

    @NotNull(message = "O ID do pedido é obrigatório.")
    private UUID orderId;

    @NotBlank(message = "O método de pagamento é obrigatório.")
    @Size(max = 50, message = "O método de pagamento deve ter no máximo 50 caracteres.")
    private String paymentMethod;

    @NotNull(message = "O valor é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
    private BigDecimal amount;

    @NotBlank(message = "O status é obrigatório.")
    @Pattern(
            regexp = "^(pending|paid|failed|refunded)$",
            message = "Status inválido. Use: pending, paid, failed ou refunded."
    )
    private String status;
}
