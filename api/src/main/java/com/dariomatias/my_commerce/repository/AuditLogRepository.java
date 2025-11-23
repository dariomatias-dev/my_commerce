package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    Page<AuditLog> findByUserIdContainingIgnoreCaseAndActionContainingIgnoreCaseAndTimestampBetween(
            String userId,
            String action,
            LocalDateTime start,
            LocalDateTime end,
            Pageable pageable
    );
}
