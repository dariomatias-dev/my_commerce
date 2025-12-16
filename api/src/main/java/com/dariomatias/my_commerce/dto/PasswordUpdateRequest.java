package com.dariomatias.my_commerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateRequest {
    private String currentPassword;
    private String newPassword;

}
