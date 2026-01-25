package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.dto.category.CategoryResponseDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ResponseEntity<ApiResult<CategoryResponseDTO>> create(@RequestBody CategoryRequestDTO request) {
        Category category = service.create(request);

        return ResponseEntity.ok(
                ApiResult.success("Categoria criada com sucesso", CategoryResponseDTO.from(category))
        );
    }

    @GetMapping
    public ResponseEntity<ApiResult<Page<CategoryResponseDTO>>> getAll(
            CategoryFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<CategoryResponseDTO> categories = service.getAll(filter, pageable)
                .map(CategoryResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Categorias obtidas com sucesso", categories)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<CategoryResponseDTO>> getById(@PathVariable UUID id) {
        Category category = service.getById(id);

        return ResponseEntity.ok(
                ApiResult.success("Categoria obtida com sucesso", CategoryResponseDTO.from(category))
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<CategoryResponseDTO>> update(
            @PathVariable UUID id,
            @RequestBody CategoryRequestDTO request
    ) {
        Category category = service.update(id, request);

        return ResponseEntity.ok(
                ApiResult.success("Categoria atualizada com sucesso", CategoryResponseDTO.from(category))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Void>> delete(@PathVariable UUID id) {
        service.delete(id);

        return ResponseEntity.ok(
                ApiResult.success("Categoria excluída com sucesso", null)
        );
    }
}
