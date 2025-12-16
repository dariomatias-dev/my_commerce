package com.dariomatias.my_commerce.dto.stores;

import com.dariomatias.my_commerce.model.Store;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class StoreResponseDTO {

    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String themeColor;
    private Boolean isActive;
    private UUID userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public StoreResponseDTO(UUID id, String name, String slug, String description, String themeColor, Boolean isActive, UUID userId,
                            LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.themeColor = themeColor;
        this.isActive = isActive;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    public static StoreResponseDTO from(Store store) {
        return new StoreResponseDTO(
                store.getId(),
                store.getName(),
                store.getSlug(),
                store.getDescription(),
                store.getThemeColor(),
                store.getIsActive(),
                store.getUserId(),
                store.getAudit().getCreatedAt(),
                store.getAudit().getUpdatedAt(),
                store.getDeletedAt()
        );
    }

}
