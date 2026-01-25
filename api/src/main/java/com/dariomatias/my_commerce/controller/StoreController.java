package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.stores.StoreFilterDTO;
import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.dto.stores.StoreResponseDTO;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.StoreService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    @PreAuthorize("hasRole('SUBSCRIBER')")
    public ResponseEntity<ApiResult<StoreResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestPart(value = "data") StoreRequestDTO request,
            @RequestPart(value = "logo") MultipartFile logo,
            @RequestPart(value = "banner") MultipartFile banner
    ) {
        Store store = service.create(user, request, logo, banner);

        return ResponseEntity.ok(
                ApiResult.success("Loja criada com sucesso", StoreResponseDTO.from(store))
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Page<StoreResponseDTO>>> getAllByUser(
            @AuthenticationPrincipal User user,
            StoreFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<StoreResponseDTO> stores = service
                .getAllStores(user, filter, pageable)
                .map(StoreResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Lojas do usuário obtidas com sucesso", stores)
        );
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SUBSCRIBER')")
    public ResponseEntity<ApiResult<Page<StoreResponseDTO>>> getMyStores(
            @AuthenticationPrincipal User user,
            StoreFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        filter.setUserId(user.getId());

        Page<StoreResponseDTO> stores = service
                .getAllStores(user, filter, pageable)
                .map(StoreResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Lojas do usuário obtidas com sucesso", stores)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<StoreResponseDTO>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        Store store = service.getById(id, user);

        return ResponseEntity.ok(
                ApiResult.success("Loja obtida com sucesso", StoreResponseDTO.from(store))
        );
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResult<StoreResponseDTO>> getBySlug(
            @PathVariable String slug
    ) {
        Store store = service.getBySlug(slug);

        return ResponseEntity.ok(
                ApiResult.success("Loja obtida com sucesso", StoreResponseDTO.from(store))
        );
    }

    @GetMapping("/active/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Long>> getActiveStoresCount() {
        long count = service.getActiveStoresCount();

        return ResponseEntity.ok(
                ApiResult.success("Quantidade de lojas ativas", count)
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<StoreResponseDTO>> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestPart(value = "data", required = false) StoreRequestDTO request,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "banner", required = false) MultipartFile banner
    ) {
        Store store = service.update(id, request, user, logo, banner);

        return ResponseEntity.ok(
                ApiResult.success("Loja atualizada com sucesso", StoreResponseDTO.from(store))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        service.delete(id, user);

        return ResponseEntity.ok(
                ApiResult.success("Loja excluída com sucesso", null)
        );
    }
}
