package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.dto.subscription.SubscriptionResponseDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.SubscriptionService;
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
public class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

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
