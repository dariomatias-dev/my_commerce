package com.dariomatias.my_commerce.dto.favorite;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class FavoriteRequestDTO {

    @NotNull(message = "O userId é obrigatório")
    private UUID userId;

    @NotNull(message = "O productId é obrigatório")
    private UUID productId;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }
}
