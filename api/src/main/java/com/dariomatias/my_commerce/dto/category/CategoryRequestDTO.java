package com.dariomatias.my_commerce.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CategoryRequestDTO {

    @NotNull(message = "A loja é obrigatória")
    private UUID storeId;

    @NotBlank(message = "O nome da categoria é obrigatório")
    private String name;

    public CategoryRequestDTO() {}

    public UUID getStoreId() {
        return storeId;
    }

    public void setStoreId(UUID storeId) {
        this.storeId = storeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
