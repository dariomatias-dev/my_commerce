package com.dariomatias.my_commerce.dto.favorite;

import com.dariomatias.my_commerce.model.Favorite;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class FavoriteResponseDTO {

    private UUID id;
    private UUID userId;
    private UUID productId;
    private LocalDateTime createdAt;

    public static FavoriteResponseDTO from(Favorite favorite) {
        FavoriteResponseDTO dto = new FavoriteResponseDTO();
        dto.setId(favorite.getId());
        dto.setUserId(favorite.getUserId());
        dto.setProductId(favorite.getProductId());
        dto.setCreatedAt(favorite.getCreatedAt());
        return dto;
    }
}
