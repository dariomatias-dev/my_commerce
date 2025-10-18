package com.dariomatias.my_commerce.dto.stores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class StoreRequestDTO {

    @NotBlank(message = "O nome da loja é obrigatório")
    private String name;

    @NotBlank(message = "A descrição da loja é obrigatória")
    private String description;

    @NotBlank(message = "A URL do banner é obrigatória")
    private String bannerUrl;

    @NotBlank(message = "A URL do logo é obrigatória")
    private String logoUrl;

    @NotBlank(message = "A cor tema é obrigatória")
    @Size(max = 7, message = "A cor tema deve ser no formato hexadecimal (#RRGGBB)")
    private String themeColor;

    @NotNull(message = "O status da loja é obrigatório")
    private Boolean isActive;

    @NotNull(message = "O proprietário da loja é obrigatório")
    private UUID ownerId;

    public StoreRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

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
}
