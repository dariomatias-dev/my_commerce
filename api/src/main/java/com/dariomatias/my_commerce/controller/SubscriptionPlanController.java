package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanRequestDTO;
import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanResponseDTO;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.service.SubscriptionPlanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ResponseEntity<ApiResult<SubscriptionPlanResponseDTO>> create(
            @RequestBody SubscriptionPlanRequestDTO request
    ) {
        SubscriptionPlan subscriptionPlan = service.create(request);

        return ResponseEntity.ok(
                ApiResult.success("Plano criado com sucesso", SubscriptionPlanResponseDTO.from(subscriptionPlan))
        );
    }

    @GetMapping
    public ResponseEntity<ApiResult<Page<SubscriptionPlanResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.ASC, "price")
        );

        Page<SubscriptionPlanResponseDTO> subscriptionPlans = service.getAll(pageable)
                .map(SubscriptionPlanResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Planos obtidos com sucesso", subscriptionPlans)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<SubscriptionPlanResponseDTO>> getById(
            @PathVariable UUID id
    ) {
        SubscriptionPlan subscriptionPlan = service.getById(id);

        return ResponseEntity.ok(
                ApiResult.success("Plano obtido com sucesso", SubscriptionPlanResponseDTO.from(subscriptionPlan))
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<SubscriptionPlanResponseDTO>> update(
            @PathVariable UUID id,
            @RequestBody SubscriptionPlanRequestDTO request
    ) {
        SubscriptionPlan subscriptionPlan = service.update(id, request);

        return ResponseEntity.ok(
                ApiResult.success("Plano atualizado com sucesso", SubscriptionPlanResponseDTO.from(subscriptionPlan))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Void>> delete(
            @PathVariable UUID id
    ) {
        service.delete(id);

        return ResponseEntity.ok(
                ApiResult.success("Plano excluído com sucesso", null)
        );
    }
}
