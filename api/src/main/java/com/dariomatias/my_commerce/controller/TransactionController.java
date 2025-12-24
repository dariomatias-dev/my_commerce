package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.transaction.TransactionRequestDTO;
import com.dariomatias.my_commerce.dto.transaction.TransactionResponseDTO;
import com.dariomatias.my_commerce.model.Transaction;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TransactionResponseDTO>> create(@RequestBody TransactionRequestDTO request) {
        Transaction transaction = service.create(request);
        return ResponseEntity.ok(ApiResponse.success("Transação criada com sucesso", TransactionResponseDTO.from(transaction)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionResponseDTO> transactions = service.getAll(pageable)
                .map(TransactionResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Transações obtidas com sucesso", transactions));
    }

    @GetMapping("/store/slug/{storeSlug}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> getAllByStoreSlug(
            @PathVariable String storeSlug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionResponseDTO> transactions = service.getAllByStoreSlug(storeSlug, pageable)
                .map(TransactionResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Transações da loja obtidas com sucesso", transactions));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> getAllByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionResponseDTO> transactions = service.getAllByUser(userId, pageable)
                .map(TransactionResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Transações obtidas com sucesso", transactions));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> getAllByMe(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionResponseDTO> transactions = service.getAllByUser(user.getId(), pageable)
                .map(TransactionResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Transações obtidas com sucesso", transactions));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<Page<TransactionResponseDTO>>> getAllByOrder(
            @PathVariable UUID orderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TransactionResponseDTO> transactions = service.getAllByOrder(orderId, pageable)
                .map(TransactionResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Transações obtidas com sucesso", transactions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponseDTO>> getById(@PathVariable UUID id) {
        Transaction transaction = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Transação obtida com sucesso", TransactionResponseDTO.from(transaction)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<TransactionResponseDTO>> update(@PathVariable UUID id,
                                                                      @RequestBody TransactionRequestDTO request) {
        Transaction transaction = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Transação atualizada com sucesso", TransactionResponseDTO.from(transaction)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Transação excluída com sucesso", null));
    }
}
