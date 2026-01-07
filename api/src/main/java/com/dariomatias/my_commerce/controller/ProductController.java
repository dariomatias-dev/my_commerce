package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.product.ProductFilterDTO;
import com.dariomatias.my_commerce.dto.product.ProductIdsRequestDTO;
import com.dariomatias.my_commerce.dto.product.ProductRequestDTO;
import com.dariomatias.my_commerce.dto.product.ProductResponseDTO;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestPart("data") ProductRequestDTO request,
            @RequestPart(value = "images") MultipartFile[] images
    ) {
        Product product = service.create(user, request, images);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Produto criado com sucesso",
                        ProductResponseDTO.from(product)
                )
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> getAll(
            @AuthenticationPrincipal User user,
            ProductFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Page<ProductResponseDTO> products = service
                .getAllByStore(user, filter, pageable)
                .map(ProductResponseDTO::from);

        return ResponseEntity.ok(
                ApiResponse.success("Produtos da loja obtidos com sucesso", products)
        );
    }

    @PostMapping("/store/products-by-ids")
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> getByIds(
            @RequestBody ProductIdsRequestDTO request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Page<ProductResponseDTO> products = service
                .getActiveProductsByStoreAndIds(request.getStoreId(), request.getProductIds(), pageable)
                .map(ProductResponseDTO::from);

        return ResponseEntity.ok(
                ApiResponse.success("Produtos obtidos com sucesso", products)
        );
    }

    @GetMapping("/store/{storeSlug}/product/{productSlug}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getBySlug(
            @PathVariable String storeSlug,
            @PathVariable String productSlug
    ) {
        Product product = service.getByStoreSlugAndProductSlug(storeSlug, productSlug);

        return ResponseEntity.ok(ApiResponse.success("Produto obtido com sucesso", ProductResponseDTO.from(product)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        Product product = service.getById(user, id);

        return ResponseEntity.ok(ApiResponse.success("Produto obtido com sucesso", ProductResponseDTO.from(product)));
    }

    @GetMapping("/store/{storeId}/stats/active-products")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Long>> getActiveProductsCount(
            @PathVariable UUID storeId
    ) {
        long count = service.getActiveProductsCount(storeId);

        return ResponseEntity.ok(
                ApiResponse.success("Quantidade de produtos ativos", count)
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestPart(value = "data", required = false) ProductRequestDTO request,
            @RequestPart(value = "images", required = false) MultipartFile[] images
    ) {
        Product product = service.update(user, id, request, images);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Produto atualizado com sucesso",
                        ProductResponseDTO.from(product)
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal User user,
                                                    @PathVariable UUID id) {
        service.delete(user, id);

        return ResponseEntity.ok(ApiResponse.success("Produto excluído com sucesso", null));
    }
}
