package com.dariomatias.my_commerce.dto.stores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class StoreRequestDTO {

    @NotBlank(message = "O nome da loja é obrigatório")
    private String name;

    @NotBlank(message = "A descrição da loja é obrigatória")
    private String description;

    @NotBlank(message = "A cor tema é obrigatória")
    @Size(max = 7, message = "A cor tema deve ser no formato hexadecimal (#RRGGBB)")
    private String themeColor;

    public StoreRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getThemeColor() { return themeColor; }
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; }
}
