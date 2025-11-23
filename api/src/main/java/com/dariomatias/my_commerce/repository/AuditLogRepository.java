package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> { }
