package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.audit_log.AuditLogFilterDTO;
import com.dariomatias.my_commerce.enums.AuditLogAction;
import com.dariomatias.my_commerce.model.AuditLog;
import com.dariomatias.my_commerce.repository.AuditLogRepository;
import com.dariomatias.my_commerce.repository.specification.AuditLogSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository repository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public void log(String userId, AuditLogAction action, String result, Map<String, Object> details) {
        AuditLog log = new AuditLog();
        log.setTimestamp(LocalDateTime.now());
        log.setUserId(userId);
        log.setAction(action);
        log.setResult(result);
        log.setDetails(details);

        repository.save(log);
    }

    public AuditLog getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Page<AuditLog> getLogs(AuditLogFilterDTO filters, Pageable pageable) {
        Query query = AuditLogSpecification.build(filters);

        long count = mongoTemplate.count(query, AuditLog.class);

        query.with(pageable);

        return new PageImpl<>(mongoTemplate.find(query, AuditLog.class), pageable, count);
    }
}
