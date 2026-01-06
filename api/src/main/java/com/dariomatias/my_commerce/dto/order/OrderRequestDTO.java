package com.dariomatias.my_commerce.dto.order;

import com.dariomatias.my_commerce.dto.order_item.OrderItemRequestDTO;
import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class OrderRequestDTO {

    @NotNull(message = "A loja é obrigatória")
    private UUID storeId;

    @NotNull(message = "O endereço é obrigatório")
    private UUID addressId;

    @NotNull(message = "O método de pagamento é obrigatório")
    private PaymentMethod paymentMethod;

    @NotNull(message = "O tipo de frete é obrigatório")
    private FreightType freightType;

    @NotEmpty(message = "O pedido deve conter ao menos um item")
    private List<OrderItemRequestDTO> items;
}
