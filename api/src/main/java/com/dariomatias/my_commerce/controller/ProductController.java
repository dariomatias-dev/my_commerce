package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.product.ProductFilterDTO;
import com.dariomatias.my_commerce.dto.product.ProductIdsRequestDTO;
import com.dariomatias.my_commerce.dto.product.ProductRequestDTO;
import com.dariomatias.my_commerce.dto.product.ProductResponseDTO;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.ProductService;
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
@RequestMapping("/api/products")
@Tag(
        name = "Products",
        description = "Endpoints for product management"
)
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @Operation(summary = "Create product", description = "Creates a new product with images for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<ProductResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestPart("data") ProductRequestDTO request,
            @RequestPart("images") MultipartFile[] images
    ) {

        Product product = service.create(user, request, images);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Produto criado com sucesso",
                        ProductResponseDTO.from(product)
                )
        );
    }

    @Operation(summary = "List products by store", description = "Returns a paginated list of products from the authenticated user's store with optional filters")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    public ResponseEntity<ApiResult<Page<ProductResponseDTO>>> getAll(
            @AuthenticationPrincipal User user,
            ProductFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<ProductResponseDTO> products = service
                .getAllByStore(user, filter, pageable)
                .map(ProductResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Produtos da loja obtidos com sucesso",
                        products
                )
        );
    }

    @Operation(summary = "Get products by IDs", description = "Returns active products by store and product identifiers")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Products not found")
    })
    @PostMapping("/store/products-by-ids")
    public ResponseEntity<ApiResult<Page<ProductResponseDTO>>> getByIds(
            @RequestBody ProductIdsRequestDTO request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<ProductResponseDTO> products = service
                .getActiveProductsByStoreAndIds(
                        request.getStoreId(),
                        request.getProductIds(),
                        pageable
                )
                .map(ProductResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Produtos obtidos com sucesso",
                        products
                )
        );
    }

    @Operation(summary = "Get product by slug", description = "Returns product details using store slug and product slug")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/store/{storeSlug}/product/{productSlug}")
    public ResponseEntity<ApiResult<ProductResponseDTO>> getBySlug(
            @PathVariable String storeSlug,
            @PathVariable String productSlug
    ) {

        Product product = service.getByStoreSlugAndProductSlug(storeSlug, productSlug);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Produto obtido com sucesso",
                        ProductResponseDTO.from(product)
                )
        );
    }

    @Operation(summary = "Get product by ID", description = "Returns product details by product identifier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<ProductResponseDTO>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {

        Product product = service.getById(user, id);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Produto obtido com sucesso",
                        ProductResponseDTO.from(product)
                )
        );
    }

    @Operation(summary = "Get total active products (user)", description = "Returns the total number of active products for the authenticated user's stores")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active products count retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/stores/stats/active-products")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Long>> getUserActiveProductsCount(
            @AuthenticationPrincipal User user
    ) {

        long count = service.getUserActiveProductsCount(user);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Quantidade total de produtos ativos",
                        count
                )
        );
    }

    @Operation(summary = "Get total active products (store)", description = "Returns the total number of active products for a specific store")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active products count retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Store not found")
    })
    @GetMapping("/store/{storeId}/stats/active-products")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Long>> getActiveProductsCount(
            @PathVariable UUID storeId
    ) {

        long count = service.getActiveProductsCount(storeId);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Quantidade de produtos ativos",
                        count
                )
        );
    }

    @Operation(summary = "Update product", description = "Updates product data and/or images")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<ProductResponseDTO>> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestPart(value = "data", required = false) ProductRequestDTO request,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {

        Product product = service.update(user, id, request, images);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Produto atualizado com sucesso",
                        ProductResponseDTO.from(product)
                )
        );
    }

    @Operation(summary = "Delete product", description = "Deletes a product by its identifier")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {

        service.delete(user, id);

        return ResponseEntity.ok(
                ApiResult.success(
                        "Produto excluído com sucesso",
                        null
                )
        );
    }
}
