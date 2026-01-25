package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.dto.subscription.SubscriptionResponseDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.SubscriptionService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@Tag(
        name = "Subscriptions",
        description = "Endpoints for managing subscriptions"
)
public class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    @Operation(summary = "Create subscription", description = "Creates a new subscription for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    @PostMapping
    public ResponseEntity<ApiResult<SubscriptionResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestBody SubscriptionRequestDTO request
    ) {

        Subscription subscription = service.create(user, request);

        return ResponseEntity.ok(
                ApiResult.success("Assinatura criada com sucesso", SubscriptionResponseDTO.from(subscription))
        );
    }

    @Operation(summary = "List all subscriptions", description = "Returns a paginated list of all subscriptions. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscriptions retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Page<SubscriptionResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<SubscriptionResponseDTO> subscriptions = service.getAll(pageable)
                .map(SubscriptionResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Assinaturas obtidas com sucesso", subscriptions)
        );
    }

    @Operation(summary = "List subscriptions by user", description = "Returns a paginated list of subscriptions for a specific user. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User subscriptions retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Page<SubscriptionResponseDTO>>> getAllByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<SubscriptionResponseDTO> subscriptions = service.getAllByUser(userId, pageable)
                .map(SubscriptionResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Assinaturas do usuário obtidas com sucesso", subscriptions)
        );
    }

    @Operation(summary = "List my subscriptions", description = "Returns a paginated list of subscriptions for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User subscriptions retrieved successfully")
    })
    @GetMapping("/user/me")
    public ResponseEntity<ApiResult<Page<SubscriptionResponseDTO>>> getAllByMe(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<SubscriptionResponseDTO> subscriptions = service.getAllByUser(user.getId(), pageable)
                .map(SubscriptionResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Assinaturas do usuário obtidas com sucesso", subscriptions)
        );
    }

    @Operation(summary = "Get active subscription for me", description = "Returns the currently active subscription for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active subscription retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/me/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<SubscriptionResponseDTO>> getActiveByMe(
            @AuthenticationPrincipal User user
    ) {

        Subscription subscription = service.getActiveByUser(user.getId());

        return ResponseEntity.ok(
                ApiResult.success("Assinatura ativa obtida com sucesso", SubscriptionResponseDTO.from(subscription))
        );
    }

    @Operation(summary = "Get subscription by ID", description = "Returns subscription details by its identifier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Subscription not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<SubscriptionResponseDTO>> getById(
            @PathVariable UUID id
    ) {

        Subscription subscription = service.getById(id);

        return ResponseEntity.ok(
                ApiResult.success("Assinatura obtida com sucesso", SubscriptionResponseDTO.from(subscription))
        );
    }

    @Operation(summary = "Change subscription plan", description = "Allows the authenticated user to change their subscription plan")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription plan changed successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    @PatchMapping("/change-plan")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<SubscriptionResponseDTO>> changePlan(
            @AuthenticationPrincipal User user,
            @RequestBody SubscriptionRequestDTO request
    ) {

        Subscription subscription = service.changePlan(user, request);

        return ResponseEntity.ok(
                ApiResult.success("Plano alterado com sucesso", SubscriptionResponseDTO.from(subscription))
        );
    }

    @Operation(summary = "Cancel active subscription", description = "Cancels the currently active subscription for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subscription cancelled successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/cancel")
    @PreAuthorize("hasRole('SUBSCRIBER')")
    public ResponseEntity<ApiResult<SubscriptionResponseDTO>> cancelActive(
            @AuthenticationPrincipal User user
    ) {

        Subscription subscription = service.cancelActiveSubscription(user);

        return ResponseEntity.ok(
                ApiResult.success("Assinatura cancelada com sucesso", SubscriptionResponseDTO.from(subscription))
        );
    }
}
