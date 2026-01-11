package com.dariomatias.my_commerce.dto.audit_log;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDateTime;

@Getter
@Setter
public class AuditLogFilterDTO {

    @Size(max = 36, message = "O userId não pode ter mais de 36 caracteres")
    private String userId;

    private String action;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @PastOrPresent(message = "startDate não pode ser no futuro")
    private LocalDateTime startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @PastOrPresent(message = "endDate não pode ser no futuro")
    private LocalDateTime endDate;
}
