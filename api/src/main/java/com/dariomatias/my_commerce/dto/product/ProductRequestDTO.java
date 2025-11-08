package com.dariomatias.my_commerce.dto.product;

import jakarta.validation.constraints.*;
import java.util.UUID;

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
    private Double price;

    @NotNull(message = "O estoque é obrigatório")
    @Min(value = 0, message = "O estoque não pode ser negativo")
    private Integer stock;

    @NotNull(message = "O campo active é obrigatório")
    private Boolean active;

    public UUID getStoreId() { return storeId; }
    public void setStoreId(UUID storeId) { this.storeId = storeId; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
