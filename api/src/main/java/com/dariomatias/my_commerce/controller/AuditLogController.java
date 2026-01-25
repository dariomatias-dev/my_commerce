package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.audit_log.AuditLogFilterDTO;
import com.dariomatias.my_commerce.model.AuditLog;
import com.dariomatias.my_commerce.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@Tag(
        name = "Audit Logs",
        description = "Endpoints for auditing and tracking system actions"
)
public class AuditLogController {

    private final AuditLogService service;

    public AuditLogController(AuditLogService service) {
        this.service = service;
    }

    @Operation(
            summary = "List audit logs",
            description = "Returns a paginated list of audit logs based on filter criteria. Admin access only."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Audit logs retrieved successfully",
                    content = @Content(schema = @Schema(implementation = AuditLog.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid filter parameters"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Page<AuditLog>>> getAll(
            @Valid AuditLogFilterDTO filters,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<AuditLog> logs = service.getLogs(filters, pageable);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Audit logs retrieved successfully.",
                        logs
                )
        );
    }

    @Operation(
            summary = "Get audit log by ID",
            description = "Returns the details of a specific audit log entry. Admin access only."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Audit log retrieved successfully",
                    content = @Content(schema = @Schema(implementation = AuditLog.class))
            ),
            @ApiResponse(responseCode = "404", description = "Audit log not found"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<AuditLog>> getById(
            @PathVariable String id
    ) {
        AuditLog log = service.getById(id);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Audit log retrieved successfully.",
                        log
                )
        );
    }
}
