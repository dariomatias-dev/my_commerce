package com.dariomatias.my_commerce.dto.product;

import com.dariomatias.my_commerce.model.Product;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ProductResponseDTO {

    private UUID id;
    private UUID storeId;
    private UUID categoryId;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductResponseDTO() {}

    public static ProductResponseDTO from(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.id = product.getId();
        dto.storeId = product.getStoreId();
        dto.categoryId = product.getCategoryId();
        dto.name = product.getName();
        dto.slug = product.getSlug();
        dto.description = product.getDescription();
        dto.price = product.getPrice();
        dto.stock = product.getStock();
        dto.active = product.getActive();
        dto.createdAt = product.getAudit().getCreatedAt();
        dto.updatedAt = product.getAudit().getUpdatedAt();
        return dto;
    }

}
