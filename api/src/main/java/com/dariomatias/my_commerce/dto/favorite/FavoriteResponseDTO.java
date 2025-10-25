package com.dariomatias.my_commerce.dto.favorite;

import com.dariomatias.my_commerce.model.Favorite;
import java.time.LocalDateTime;
import java.util.UUID;

public class FavoriteResponseDTO {

    private UUID id;
    private UUID userId;
    private UUID productId;
    private LocalDateTime createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static FavoriteResponseDTO from(Favorite favorite) {
        FavoriteResponseDTO dto = new FavoriteResponseDTO();
        dto.setId(favorite.getId());
        dto.setUserId(favorite.getUserId());
        dto.setProductId(favorite.getProductId());
        dto.setCreatedAt(favorite.getCreatedAt());
        return dto;
    }
}
