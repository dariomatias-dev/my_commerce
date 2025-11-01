package com.dariomatias.my_commerce.dto.transaction;

import com.dariomatias.my_commerce.enums.PaymentMethod;
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

    @NotNull(message = "O método de pagamento é obrigatório.")
    private PaymentMethod paymentMethod;

    @NotNull(message = "O valor é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
    private BigDecimal amount;
}
