package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.model.AuditLog;
import com.dariomatias.my_commerce.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository repository;

    public void log(String userId, String action, String result, Map<String, Object> details) {
        AuditLog log = new AuditLog();
        log.setTimestamp(LocalDateTime.now());
        log.setUserId(userId);
        log.setAction(action);
        log.setResult(result);
        log.setDetails(details);
        repository.save(log);
    }

    public Page<AuditLog> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public AuditLog getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Page<AuditLog> search(String userId, String action, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        String user = userId == null ? "" : userId;
        String act = action == null ? "" : action;

        LocalDateTime startDate = start == null ? LocalDateTime.of(1970, 1, 1, 0, 0) : start;
        LocalDateTime endDate = end == null ? LocalDateTime.of(9999, 12, 31, 23, 59, 59) : end;

        return repository.findByUserIdContainingIgnoreCaseAndActionContainingIgnoreCaseAndTimestampBetween(
                user, act, startDate, endDate, pageable
        );
    }
}
