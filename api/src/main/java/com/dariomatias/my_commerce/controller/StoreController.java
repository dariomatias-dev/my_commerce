package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.stores.StoreFilterDTO;
import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.dto.stores.StoreResponseDTO;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.StoreService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService service;

    public StoreController(StoreService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<StoreResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestPart(value = "data") StoreRequestDTO request,
            @RequestPart(value = "logo") MultipartFile logo,
            @RequestPart(value = "banner") MultipartFile banner
    ) {
        Store entity = service.create(user, request, logo, banner);

        return ResponseEntity.ok(ApiResponse.success("Loja criada com sucesso", StoreResponseDTO.from(entity)));
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<StoreResponseDTO>>> getAllByUser(
            @AuthenticationPrincipal User user,
            StoreFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StoreResponseDTO> stores = service
                .getAllStores(user, filter, pageable)
                .map(StoreResponseDTO::from);

        return ResponseEntity.ok(
                ApiResponse.success("Lojas do usuário obtidas com sucesso", stores)
        );
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Page<StoreResponseDTO>>> getMyStores(
            @AuthenticationPrincipal User user,
            StoreFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        filter.setUserId(user.getId());
        Page<StoreResponseDTO> stores = service
                .getAllStores(user, filter, pageable)
                .map(StoreResponseDTO::from);

        return ResponseEntity.ok(
                ApiResponse.success("Lojas do usuário obtidas com sucesso", stores)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StoreResponseDTO>> getById(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        Store entity = service.getById(id, user);

        return ResponseEntity.ok(ApiResponse.success("Loja obtida com sucesso", StoreResponseDTO.from(entity)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<StoreResponseDTO>> getBySlug(@PathVariable String slug) {
        Store entity = service.getBySlug(slug);

        return ResponseEntity.ok(ApiResponse.success("Loja obtida com sucesso", StoreResponseDTO.from(entity)));
    }

    @GetMapping("/active/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getActiveStoresCount() {
        long count = service.getActiveStoresCount();

        return ResponseEntity.ok(ApiResponse.success("Quantidade de lojas ativas", count));
    }

    @GetMapping("/active/new-this-month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getNewActiveStoresThisMonth() {
        long count = service.getNewActiveStoresThisMonth();

        return ResponseEntity.ok(ApiResponse.success("Quantidade de novas lojas ativas desde o início do mês", count));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<StoreResponseDTO>> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestPart(value = "data", required = false) StoreRequestDTO request,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "banner", required = false) MultipartFile banner
    ) {
        Store entity = service.update(id, request, user, logo, banner);

        return ResponseEntity.ok(ApiResponse.success("Loja atualizada com sucesso", StoreResponseDTO.from(entity)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal User user, @PathVariable UUID id) {
        service.delete(id, user);

        return ResponseEntity.ok(ApiResponse.success("Loja excluída com sucesso", null));
    }
}
