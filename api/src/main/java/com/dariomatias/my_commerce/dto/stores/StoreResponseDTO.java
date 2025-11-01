package com.dariomatias.my_commerce.dto.stores;

import com.dariomatias.my_commerce.model.Store;
import java.time.LocalDateTime;
import java.util.UUID;

public class StoreResponseDTO {

    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String bannerUrl;
    private String logoUrl;
    private String themeColor;
    private Boolean isActive;
    private UUID ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StoreResponseDTO() {}

    public StoreResponseDTO(UUID id, String name, String slug, String description, String bannerUrl,
                            String logoUrl, String themeColor, Boolean isActive, UUID ownerId,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.bannerUrl = bannerUrl;
        this.logoUrl = logoUrl;
        this.themeColor = themeColor;
        this.isActive = isActive;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static StoreResponseDTO from(Store store) {
        return new StoreResponseDTO(
                store.getId(),
                store.getName(),
                store.getSlug(),
                store.getDescription(),
                store.getBannerUrl(),
                store.getLogoUrl(),
                store.getThemeColor(),
                store.getIsActive(),
                store.getOwnerId(),
                store.getAudit().getCreatedAt(),
                store.getAudit().getUpdatedAt()
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

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getThemeColor() { return themeColor; }
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
