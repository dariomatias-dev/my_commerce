package com.dariomatias.my_commerce.dto.category;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CategoryFilterDTO {

    @NotNull(message = "O ID da loja é obrigatório")
    private UUID storeId;

    private String name;
}
