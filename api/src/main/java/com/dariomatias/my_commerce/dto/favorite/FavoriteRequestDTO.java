package com.dariomatias.my_commerce.dto.favorite;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class FavoriteRequestDTO {

    @NotNull(message = "O userId é obrigatório")
    private UUID userId;

    @NotNull(message = "O productId é obrigatório")
    private UUID productId;

}
