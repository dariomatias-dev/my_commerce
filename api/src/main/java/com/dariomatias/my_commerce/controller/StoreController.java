package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.stores.StoreFilterDTO;
import com.dariomatias.my_commerce.dto.stores.StoreRequestDTO;
import com.dariomatias.my_commerce.dto.stores.StoreResponseDTO;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.StoreService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/stores")
@Tag(
        name = "Stores",
        description = "Endpoints for store management"
)
public class StoreController {

    private final StoreService service;

    public StoreController(StoreService service) {
        this.service = service;
    }

    @Operation(summary = "Create store", description = "Creates a new store for the authenticated subscriber")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Store created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PostMapping
    @PreAuthorize("hasRole('SUBSCRIBER')")
    public ResponseEntity<ApiResult<StoreResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestPart("data") StoreRequestDTO request,
            @RequestPart("logo") MultipartFile logo,
            @RequestPart("banner") MultipartFile banner
    ) {

        Store store = service.create(user, request, logo, banner);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Loja criada com sucesso",
                        StoreResponseDTO.from(store)
                )
        );
    }

    @Operation(summary = "List all stores", description = "Returns a paginated list of stores with optional filters. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stores retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
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
                ApiResult.success(
                        "Lojas do usuário obtidas com sucesso",
                        stores
                )
        );
    }

    @Operation(summary = "List my stores", description = "Returns a paginated list of stores owned by the authenticated subscriber")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stores retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
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
                ApiResult.success(
                        "Lojas do usuário obtidas com sucesso",
                        stores
                )
        );
    }

    @Operation(summary = "Get store by ID", description = "Returns store details by identifier. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Store retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Store not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<StoreResponseDTO>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {

        Store store = service.getById(id, user);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Loja obtida com sucesso",
                        StoreResponseDTO.from(store)
                )
        );
    }

    @Operation(summary = "Get store by slug", description = "Returns store details using its public slug")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Store retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Store not found")
    })
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResult<StoreResponseDTO>> getBySlug(
            @PathVariable String slug
    ) {

        Store store = service.getBySlug(slug);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Loja obtida com sucesso",
                        StoreResponseDTO.from(store)
                )
        );
    }

    @Operation(summary = "Get active stores count", description = "Returns the total number of active stores. Admin access only")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active stores count retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/active/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Long>> getActiveStoresCount() {

        long count = service.getActiveStoresCount();

        return ResponseEntity.ok(
                ApiResult.success(
                        "Quantidade de lojas ativas",
                        count
                )
        );
    }

    @Operation(summary = "Update store", description = "Updates store data, logo and/or banner")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Store updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
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
                ApiResult.success(
                        "Loja atualizada com sucesso",
                        StoreResponseDTO.from(store)
                )
        );
    }

    @Operation(summary = "Delete store", description = "Deletes a store by its identifier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Store deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Store not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {

        service.delete(id, user);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Loja excluída com sucesso",
                        null
                )
        );
    }
}
