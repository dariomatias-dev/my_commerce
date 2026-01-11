package com.dariomatias.my_commerce.dto.product;

import com.dariomatias.my_commerce.enums.StatusFilter;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ProductFilterDTO {

    @NotNull(message = "O ID da loja é obrigatório")
    private UUID storeId;

    private UUID categoryId;

    private String name;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private StatusFilter status;

    private Integer lowStockThreshold;
}
