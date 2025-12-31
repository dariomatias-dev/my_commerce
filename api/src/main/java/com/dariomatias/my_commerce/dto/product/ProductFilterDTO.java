package com.dariomatias.my_commerce.dto.product;

import java.util.UUID;

public class ProductFilterDTO {

    private UUID categoryId;

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }
}
