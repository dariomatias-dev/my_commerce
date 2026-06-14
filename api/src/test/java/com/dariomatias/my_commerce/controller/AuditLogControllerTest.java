package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.dto.audit_log.AuditLogFilterDTO;
import com.dariomatias.my_commerce.enums.AuditLogAction;
import com.dariomatias.my_commerce.model.AuditLog;
import com.dariomatias.my_commerce.service.AuditLogService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ControllerTest(AuditLogController.class)
class AuditLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuditLogService service;

    private AuditLog log;

    @BeforeEach
    void setUp() {
        log = new AuditLog();
        log.setId("abc123");
        log.setUserId("user-uuid");
        log.setAction(AuditLogAction.LOGIN);
        log.setResult("SUCCESS");
        log.setTimestamp(LocalDateTime.now());
    }

    @Nested
    @DisplayName("GET /api/audit-logs")
    class GetAll {

        @Test
        @DisplayName("should return audit log page with query params")
        void shouldReturnAuditLogPage() throws Exception {
            Page<AuditLog> page = new PageImpl<>(List.of(log));
            when(service.getLogs(any(AuditLogFilterDTO.class), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/audit-logs")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].id").value("abc123"))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(service).getLogs(any(AuditLogFilterDTO.class), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/audit-logs/{id}")
    class GetById {

        @Test
        @DisplayName("should return audit log by ID")
        void shouldReturnAuditLogById() throws Exception {
            when(service.getById("abc123")).thenReturn(log);

            mockMvc.perform(get("/api/audit-logs/{id}", "abc123"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value("abc123"))
                    .andExpect(jsonPath("$.data.action").value("LOGIN"));

            verify(service).getById("abc123");
        }
    }
}
