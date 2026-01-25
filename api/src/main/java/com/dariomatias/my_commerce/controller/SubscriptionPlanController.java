package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanRequestDTO;
import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanResponseDTO;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.service.SubscriptionPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@Tag(
        name = "Subscription Plans",
        description = "Endpoints for managing subscription plans"
)
public class SubscriptionPlanController {

    private final SubscriptionPlanService service;

    public SubscriptionPlanController(SubscriptionPlanService service) {
        this.service = service;
    }

    @Operation(summary = "Create subscription plan", description = "Creates a new subscription plan. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription plan created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
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

    @Operation(summary = "List all subscription plans", description = "Returns a paginated list of subscription plans, sorted by price")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription plans retrieved successfully")
    })
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

    @Operation(summary = "Get subscription plan by ID", description = "Returns the details of a subscription plan by its identifier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription plan retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Subscription plan not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<SubscriptionPlanResponseDTO>> getById(
            @PathVariable UUID id
    ) {

        SubscriptionPlan subscriptionPlan = service.getById(id);

        return ResponseEntity.ok(
                ApiResult.success("Plano obtido com sucesso", SubscriptionPlanResponseDTO.from(subscriptionPlan))
        );
    }

    @Operation(summary = "Update subscription plan", description = "Updates a subscription plan by its ID. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription plan updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Subscription plan not found")
    })
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

    @Operation(summary = "Delete subscription plan", description = "Deletes a subscription plan by its ID. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription plan deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Subscription plan not found")
    })
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
