package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.audit_log.AuditLogFilterDTO;
import com.dariomatias.my_commerce.enums.AuditLogAction;
import com.dariomatias.my_commerce.model.AuditLog;
import com.dariomatias.my_commerce.repository.AuditLogRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuditLogService")
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository repository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private AuditLogService auditLogService;

    @Nested
    @DisplayName("log")
    class Log {

        @Test
        @DisplayName("saves AuditLog with all fields populated")
        void savesAuditLogWithCorrectFields() {
            String userId = "user-123";
            AuditLogAction action = AuditLogAction.LOGIN;
            String result = "success";
            Map<String, Object> details = Map.of("ip", "127.0.0.1");

            auditLogService.log(userId, action, result, details);

            ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
            verify(repository).save(captor.capture());

            AuditLog saved = captor.getValue();
            assertEquals(userId, saved.getUserId());
            assertEquals(action, saved.getAction());
            assertEquals(result, saved.getResult());
            assertEquals(details, saved.getDetails());
            assertNotNull(saved.getTimestamp());
        }
    }

    @Nested
    @DisplayName("getById")
    class GetById {

        @Test
        @DisplayName("existing id should return log")
        void existingId_shouldReturnLog() {
            AuditLog log = new AuditLog();
            log.setId("abc-123");
            when(repository.findById("abc-123")).thenReturn(Optional.of(log));

            AuditLog result = auditLogService.getById("abc-123");

            assertNotNull(result);
            assertEquals("abc-123", result.getId());
        }

        @Test
        @DisplayName("non-existing id should return null")
        void nonExistingId_shouldReturnNull() {
            when(repository.findById("not-found")).thenReturn(Optional.empty());

            AuditLog result = auditLogService.getById("not-found");

            assertNull(result);
        }
    }

    @Nested
    @DisplayName("getLogs")
    class GetLogs {

        @Test
        @DisplayName("delegates count and search to MongoTemplate and returns page")
        void delegatesToMongoTemplateAndReturnsPage() {
            AuditLogFilterDTO filters = new AuditLogFilterDTO();
            filters.setUserId("user-abc");
            Pageable pageable = PageRequest.of(0, 10);

            AuditLog log = new AuditLog();
            when(mongoTemplate.count(any(), eq(AuditLog.class))).thenReturn(1L);
            when(mongoTemplate.find(any(), eq(AuditLog.class))).thenReturn(List.of(log));

            var page = auditLogService.getLogs(filters, pageable);

            assertEquals(1, page.getTotalElements());
            assertEquals(1, page.getContent().size());
            verify(mongoTemplate).count(any(), eq(AuditLog.class));
            verify(mongoTemplate).find(any(), eq(AuditLog.class));
        }
    }
}
