package com.dariomatias.my_commerce.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CategoryRequestDTO {

    @NotNull(message = "A loja é obrigatória")
    private UUID storeId;

    @NotBlank(message = "O nome da categoria é obrigatório")
    private String name;

    public CategoryRequestDTO() {}

}
