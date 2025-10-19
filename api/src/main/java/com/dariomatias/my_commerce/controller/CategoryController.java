package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.dto.category.CategoryResponseDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> create(@RequestBody CategoryRequestDTO request) {
        Category category = service.create(request);
        return ResponseEntity.ok(ApiResponse.success("Categoria criada com sucesso", CategoryResponseDTO.from(category)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<CategoryResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CategoryResponseDTO> categories = service.getAll(pageable)
                .map(CategoryResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Categorias obtidas com sucesso", categories));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<ApiResponse<Page<CategoryResponseDTO>>> getAllByStore(
            @PathVariable UUID storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CategoryResponseDTO> categories = service.getAllByStore(storeId, pageable)
                .map(CategoryResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Categorias obtidas com sucesso", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> getById(@PathVariable UUID id) {
        Category category = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Categoria obtida com sucesso", CategoryResponseDTO.from(category)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> update(@PathVariable UUID id,
                                                                   @RequestBody CategoryRequestDTO request) {
        Category category = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Categoria atualizada com sucesso", CategoryResponseDTO.from(category)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Categoria excluída com sucesso", null));
    }
}
