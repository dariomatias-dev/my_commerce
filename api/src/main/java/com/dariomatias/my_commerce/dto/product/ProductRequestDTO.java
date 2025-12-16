package com.dariomatias.my_commerce.dto.product;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ProductRequestDTO {

    @NotNull(message = "O ID da loja é obrigatório")
    private UUID storeId;

    @NotNull(message = "O ID da categoria é obrigatório")
    private UUID categoryId;

    @NotBlank(message = "O nome do produto é obrigatório")
    @Size(max = 255, message = "O nome do produto deve ter no máximo 255 caracteres")
    private String name;

    @NotBlank(message = "A descrição do produto é obrigatória")
    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
    private String description;

    @NotNull(message = "O preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "O preço deve ser maior que 0")
    private BigDecimal price;

    @NotNull(message = "O estoque é obrigatório")
    @Min(value = 0, message = "O estoque não pode ser negativo")
    private Integer stock;

    @NotNull(message = "O campo active é obrigatório")
    private Boolean active;

}
