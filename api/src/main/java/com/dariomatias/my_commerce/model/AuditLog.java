package com.dariomatias.my_commerce.model;

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
    private String action;
    private String result;
    private Map<String, Object> details;
}
