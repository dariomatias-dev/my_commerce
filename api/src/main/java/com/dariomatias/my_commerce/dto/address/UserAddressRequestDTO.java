package com.dariomatias.my_commerce.dto.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserAddressRequestDTO(

        @NotBlank(message = "O campo label é obrigatório")
        @Size(max = 50, message = "O campo label deve ter no máximo 50 caracteres")
        String label,

        @NotBlank(message = "O campo rua é obrigatório")
        String street,

        @NotBlank(message = "O campo número é obrigatório")
        String number,

        String complement,

        @NotBlank(message = "O campo bairro é obrigatório")
        String neighborhood,

        @NotBlank(message = "O campo cidade é obrigatório")
        String city,

        @NotBlank(message = "O campo UF é obrigatório")
        @Size(min = 2, max = 2, message = "UF inválida")
        String state,

        @NotBlank(message = "O campo CEP é obrigatório")
        @Pattern(regexp = "\\d{5}-\\d{3}", message = "O CEP deve estar no formato 00000-000")
        String zip,

        @NotNull(message = "A latitude é obrigatória")
        Double latitude,

        @NotNull(message = "A longitude é obrigatória")
        Double longitude
) {}
