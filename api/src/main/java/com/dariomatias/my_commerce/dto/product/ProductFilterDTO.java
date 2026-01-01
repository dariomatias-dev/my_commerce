package com.dariomatias.my_commerce.dto.product;

import com.dariomatias.my_commerce.enums.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ProductFilterDTO {

    @NotNull(message = "O ID da loja é obrigatório")
    private UUID storeId;

    private UUID categoryId;

    private Integer lowStockThreshold;

    private ProductStatus status;
}
