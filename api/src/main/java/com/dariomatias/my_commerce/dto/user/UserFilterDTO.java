package com.dariomatias.my_commerce.dto.user;

import com.dariomatias.my_commerce.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserFilterDTO {

    @Size(max = 100, message = "O nome não pode ter mais de 100 caracteres")
    private String name;

    @Email(message = "Email inválido")
    private String email;

    private UserRole role;
}
