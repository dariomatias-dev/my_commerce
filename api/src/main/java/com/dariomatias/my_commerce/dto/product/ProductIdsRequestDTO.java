package com.dariomatias.my_commerce.dto.product;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ProductIdsRequestDTO {

    @NotNull(message = "O ID da loja é obrigatório")
    private UUID storeId;

    @NotEmpty(message = "A lista de IDs de produtos não pode estar vazia")
    private List<UUID> productIds;
}
