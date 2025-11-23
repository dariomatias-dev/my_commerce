package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.model.AuditLog;
import com.dariomatias.my_commerce.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuditLogService {
    private final AuditLogRepository repository;

    public AuditLogService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void log(String userId, String action, String result, Map<String, Object> details) {
        AuditLog log = new AuditLog();
        log.setTimestamp(LocalDateTime.now());
        log.setUserId(userId);
        log.setAction(action);
        log.setResult(result);
        log.setDetails(details);
        repository.save(log);
    }
}
