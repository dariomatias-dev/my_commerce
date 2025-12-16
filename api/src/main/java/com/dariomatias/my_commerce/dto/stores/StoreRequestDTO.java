package com.dariomatias.my_commerce.dto.stores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreRequestDTO {

    @NotBlank(message = "O nome da loja é obrigatório")
    private String name;

    @NotBlank(message = "A descrição da loja é obrigatória")
    private String description;

    @NotBlank(message = "A cor tema é obrigatória")
    @Size(max = 7, message = "A cor tema deve ser no formato hexadecimal (#RRGGBB)")
    private String themeColor;

    public StoreRequestDTO() {}

}
