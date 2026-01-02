package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.favorite.FavoriteRequestDTO;
import com.dariomatias.my_commerce.dto.favorite.FavoriteResponseDTO;
import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.service.FavoriteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService service;

    public FavoriteController(FavoriteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponseDTO>> create(@RequestBody FavoriteRequestDTO request) {
        Favorite favorite = service.create(request);

        return ResponseEntity.ok(ApiResponse.success("Favorito criado com sucesso", FavoriteResponseDTO.from(favorite)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<FavoriteResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FavoriteResponseDTO> favorites = service.getAll(pageable).map(FavoriteResponseDTO::from);

        return ResponseEntity.ok(ApiResponse.success("Favoritos obtidos com sucesso", favorites));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<FavoriteResponseDTO>>> getAllByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FavoriteResponseDTO> favorites = service.getAllByUser(userId, pageable).map(FavoriteResponseDTO::from);

        return ResponseEntity.ok(ApiResponse.success("Favoritos do usuário obtidos com sucesso", favorites));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<Page<FavoriteResponseDTO>>> getAllByProduct(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FavoriteResponseDTO> favorites = service.getAllByProduct(productId, pageable).map(FavoriteResponseDTO::from);

        return ResponseEntity.ok(ApiResponse.success("Favoritos do produto obtidos com sucesso", favorites));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FavoriteResponseDTO>> getById(@PathVariable UUID id) {
        Favorite favorite = service.getById(id);

        return ResponseEntity.ok(ApiResponse.success("Favorito obtido com sucesso", FavoriteResponseDTO.from(favorite)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);

        return ResponseEntity.ok(ApiResponse.success("Favorito deletado com sucesso", null));
    }
}
