package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanRequestDTO;
import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanResponseDTO;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.service.SubscriptionPlanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/subscription-plans")
public class SubscriptionPlanController {

    private final SubscriptionPlanService service;

    public SubscriptionPlanController(SubscriptionPlanService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubscriptionPlanResponseDTO>> create(@RequestBody SubscriptionPlanRequestDTO request) {
        SubscriptionPlan plan = service.create(request);

        return ResponseEntity.ok(ApiResponse.success("Plano criado com sucesso", SubscriptionPlanResponseDTO.from(plan)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SubscriptionPlanResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SubscriptionPlanResponseDTO> plans = service.getAll(pageable)
                .map(SubscriptionPlanResponseDTO::from);

        return ResponseEntity.ok(ApiResponse.success("Planos obtidos com sucesso", plans));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubscriptionPlanResponseDTO>> getById(@PathVariable UUID id) {
        SubscriptionPlan plan = service.getById(id);

        return ResponseEntity.ok(ApiResponse.success("Plano obtido com sucesso", SubscriptionPlanResponseDTO.from(plan)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubscriptionPlanResponseDTO>> update(
            @PathVariable UUID id,
            @RequestBody SubscriptionPlanRequestDTO request
    ) {
        SubscriptionPlan plan = service.update(id, request);

        return ResponseEntity.ok(ApiResponse.success("Plano atualizado com sucesso", SubscriptionPlanResponseDTO.from(plan)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);

        return ResponseEntity.ok(ApiResponse.success("Plano excluído com sucesso", null));
    }
}
