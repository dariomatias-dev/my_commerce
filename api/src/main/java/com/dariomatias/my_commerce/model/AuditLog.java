package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.enums.AuditLogAction;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Document(collection = "auditLogs")
public class AuditLog {
    @Id
    private String id;
    private LocalDateTime timestamp;
    private String userId;
    private AuditLogAction action;
    private String result;
    private Map<String, Object> details;
}
