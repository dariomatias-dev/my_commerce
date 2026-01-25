package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.order.OrderDetailsResponseDTO;
import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.dto.order.OrderResponseDTO;
import com.dariomatias.my_commerce.dto.stores.StoreResponseDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResult<OrderResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid OrderRequestDTO request
    ) {
        Order order = service.create(user, request);

        return ResponseEntity.ok(
                ApiResult.success("Pedido criado com sucesso", OrderResponseDTO.from(order))
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Page<OrderResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<OrderResponseDTO> orders =
                service.getAll(pageable)
                        .map(OrderResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Pedidos obtidos com sucesso", orders)
        );
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Page<OrderResponseDTO>>> getAllByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<OrderResponseDTO> orders =
                service.getAllByUser(userId, pageable)
                        .map(OrderResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Pedidos do usuário obtidos com sucesso", orders)
        );
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Page<OrderResponseDTO>>> getAllByStore(
            @PathVariable UUID storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<OrderResponseDTO> orders =
                service.getAllByStore(storeId, pageable)
                        .map(OrderResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Pedidos da loja obtidos com sucesso", orders)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResult<Page<OrderResponseDTO>>> getMyOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<OrderResponseDTO> orders =
                service.getAllByUser(user.getId(), pageable)
                        .map(OrderResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Pedidos do usuário obtidos com sucesso", orders)
        );
    }

    @GetMapping("/me/stores")
    public ResponseEntity<ApiResult<Page<StoreResponseDTO>>> getMyOrderStores(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Page<StoreResponseDTO> stores =
                service.getMyOrderStores(user.getId(), pageable)
                        .map(StoreResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Lojas com pedidos obtidas com sucesso", stores)
        );
    }

    @GetMapping("/me/store/{storeId}")
    public ResponseEntity<ApiResult<Page<OrderResponseDTO>>> getMyOrdersByStore(
            @AuthenticationPrincipal User user,
            @PathVariable UUID storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<OrderResponseDTO> orders =
                service.getMyOrdersByStore(user.getId(), storeId, pageable)
                        .map(OrderResponseDTO::from);

        return ResponseEntity.ok(
                ApiResult.success("Pedidos da loja obtidos com sucesso", orders)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<OrderDetailsResponseDTO>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                ApiResult.success("Pedido obtido com sucesso", service.getById(id, user))
        );
    }

    @GetMapping("/store/{storeId}/stats/successful-sales")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResult<Long>> getSuccessfulSalesCount(
            @PathVariable UUID storeId
    ) {
        long count = service.getSuccessfulSalesCount(storeId);

        return ResponseEntity.ok(
                ApiResult.success("Total de vendas bem-sucedidas", count)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResult<Void>> delete(
            @PathVariable UUID id
    ) {
        service.delete(id);

        return ResponseEntity.ok(
                ApiResult.success("Pedido excluído com sucesso", null)
        );
    }
}
