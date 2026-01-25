package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.dto.category.CategoryResponseDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "Categories",
        description = "Endpoints for managing product categories"
)
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @Operation(
            summary = "Create category",
            description = "Creates a new product category. Admin or Subscriber access required."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Category created successfully",
                    content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid category data"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<CategoryResponseDTO>> create(
            @RequestBody CategoryRequestDTO request
    ) {
        Category category = service.create(request);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Category created successfully.",
                        CategoryResponseDTO.from(category)
                )
        );
    }

    @Operation(
            summary = "List categories",
            description = "Returns a paginated list of categories with optional filters."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Categories retrieved successfully",
                    content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class))
            )
    })
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
                ApiResult.success(
                        "Categories retrieved successfully.",
                        categories
                )
        );
    }

    @Operation(
            summary = "Get category by ID",
            description = "Returns a specific category by its unique identifier."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Category retrieved successfully",
                    content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<CategoryResponseDTO>> getById(
            @PathVariable UUID id
    ) {
        Category category = service.getById(id);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Category retrieved successfully.",
                        CategoryResponseDTO.from(category)
                )
        );
    }

    @Operation(
            summary = "Update category",
            description = "Updates an existing category. Admin or Subscriber access required."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Category updated successfully",
                    content = @Content(schema = @Schema(implementation = CategoryResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid category data"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<CategoryResponseDTO>> update(
            @PathVariable UUID id,
            @RequestBody CategoryRequestDTO request
    ) {
        Category category = service.update(id, request);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Category updated successfully.",
                        CategoryResponseDTO.from(category)
                )
        );
    }

    @Operation(
            summary = "Delete category",
            description = "Deletes a category by its ID. Admin or Subscriber access required."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Void>> delete(
            @PathVariable UUID id
    ) {
        service.delete(id);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Category deleted successfully.",
                        null
                )
        );
    }
}
