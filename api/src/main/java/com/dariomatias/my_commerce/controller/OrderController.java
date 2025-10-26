package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.dto.order.OrderResponseDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> create(@RequestBody OrderRequestDTO request) {
        Order order = service.create(request);
        return ResponseEntity.ok(ApiResponse.success("Pedido criado com sucesso", OrderResponseDTO.from(order)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> orders = service.getAll(pageable).map(OrderResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Pedidos obtidos com sucesso", orders));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getAllByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> orders = service.getAllByUser(userId, pageable).map(OrderResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Pedidos do usuário obtidos com sucesso", orders));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<ApiResponse<Page<OrderResponseDTO>>> getAllByStore(
            @PathVariable UUID storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> orders = service.getAllByStore(storeId, pageable).map(OrderResponseDTO::from);
        return ResponseEntity.ok(ApiResponse.success("Pedidos da loja obtidos com sucesso", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getById(@PathVariable UUID id) {
        Order order = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Pedido obtido com sucesso", OrderResponseDTO.from(order)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> update(@PathVariable UUID id,
                                                                @RequestBody OrderRequestDTO request) {
        Order order = service.update(id,
                request.getStoreId(),
                request.getUserId(),
                request.getTotalAmount(),
                request.getStatus()
        );
        return ResponseEntity.ok(ApiResponse.success("Pedido atualizado com sucesso", OrderResponseDTO.from(order)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Pedido excluído com sucesso", null));
    }
}
