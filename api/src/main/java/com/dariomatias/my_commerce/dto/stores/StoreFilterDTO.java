package com.dariomatias.my_commerce.dto.stores;

import com.dariomatias.my_commerce.enums.StatusFilter;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class StoreFilterDTO {

    @NotNull(message = "O ID do usuário é obrigatório")
    private UUID userId;

    private StatusFilter status = StatusFilter.ACTIVE;
}
