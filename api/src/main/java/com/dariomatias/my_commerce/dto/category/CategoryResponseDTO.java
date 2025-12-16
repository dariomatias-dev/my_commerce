package com.dariomatias.my_commerce.dto.category;

import com.dariomatias.my_commerce.model.Category;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class CategoryResponseDTO {

    private UUID id;
    private UUID storeId;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CategoryResponseDTO(UUID id, UUID storeId, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static CategoryResponseDTO from(Category category) {
        return new CategoryResponseDTO(
                category.getId(),
                category.getStoreId(),
                category.getName(),
                category.getAudit().getCreatedAt(),
                category.getAudit().getUpdatedAt()
        );
    }

}
