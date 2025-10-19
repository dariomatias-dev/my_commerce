package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.dto.subscription.SubscriptionResponseDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.service.SubscriptionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity<ApiResponse<SubscriptionResponseDTO>> create(@RequestBody SubscriptionRequestDTO request) {
        Subscription subscription = service.create(request);
        return ResponseEntity.ok(ApiResponse.success("Assinatura criada com sucesso", SubscriptionResponseDTO.from(subscription)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<SubscriptionResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SubscriptionResponseDTO> subscriptions = service.getAll(pageable)
                .map(SubscriptionResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Assinaturas obtidas com sucesso", subscriptions));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<SubscriptionResponseDTO>>> getAllByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SubscriptionResponseDTO> subscriptions = service.getAllByUser(userId, pageable)
                .map(SubscriptionResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Assinaturas do usuário obtidas com sucesso", subscriptions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubscriptionResponseDTO>> getById(@PathVariable UUID id) {
        Subscription subscription = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Assinatura obtida com sucesso", SubscriptionResponseDTO.from(subscription)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SubscriptionResponseDTO>> update(@PathVariable UUID id,
                                                                       @RequestBody SubscriptionRequestDTO request) {
        Subscription subscription = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Assinatura atualizada com sucesso", SubscriptionResponseDTO.from(subscription)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Assinatura excluída com sucesso", null));
    }
}
