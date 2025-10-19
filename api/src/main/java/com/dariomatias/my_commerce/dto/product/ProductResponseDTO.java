package com.dariomatias.my_commerce.dto.product;

import com.dariomatias.my_commerce.model.Product;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ProductResponseDTO {

    private UUID id;
    private UUID storeId;
    private UUID categoryId;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean active;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductResponseDTO() {}

    public static ProductResponseDTO from(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.id = product.getId();
        dto.storeId = product.getStoreId();
        dto.categoryId = product.getCategoryId();
        dto.name = product.getName();
        dto.description = product.getDescription();
        dto.price = product.getPrice();
        dto.stock = product.getStock();
        dto.active = product.getActive();
        dto.images = product.getImages();
        dto.createdAt = product.getCreatedAt();
        dto.updatedAt = product.getUpdatedAt();
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
