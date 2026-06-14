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
        @DisplayName("salva AuditLog com todos os campos preenchidos")
        void salvaAuditLogComCamposCorretos() {
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
        @DisplayName("id existente deve retornar o log")
        void idExistente_deveRetornarLog() {
            AuditLog log = new AuditLog();
            log.setId("abc-123");
            when(repository.findById("abc-123")).thenReturn(Optional.of(log));

            AuditLog result = auditLogService.getById("abc-123");

            assertNotNull(result);
            assertEquals("abc-123", result.getId());
        }

        @Test
        @DisplayName("id inexistente deve retornar null")
        void idInexistente_deveRetornarNull() {
            when(repository.findById("nao-existe")).thenReturn(Optional.empty());

            AuditLog result = auditLogService.getById("nao-existe");

            assertNull(result);
        }
    }

    @Nested
    @DisplayName("getLogs")
    class GetLogs {

        @Test
        @DisplayName("delega contagem e busca ao MongoTemplate e retorna página")
        void delegaParaMongoTemplateERetornaPagina() {
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
