package com.dariomatias.my_commerce.dto.stores;

import com.dariomatias.my_commerce.model.Store;
import java.time.LocalDateTime;
import java.util.UUID;

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

    public StoreResponseDTO() {}

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

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getThemeColor() { return themeColor; }
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
