package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.order_item.OrderItemRequestDTO;
import com.dariomatias.my_commerce.dto.order_item.OrderItemResponseDTO;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.service.OrderItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService service;

    public OrderItemController(OrderItemService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<OrderItemResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderItemResponseDTO> items = service.getAll(pageable).map(OrderItemResponseDTO::from);

        return ResponseEntity.ok(ApiResponse.success("Itens obtidos com sucesso", items));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<Page<OrderItemResponseDTO>>> getAllByOrder(
            @PathVariable UUID orderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderItemResponseDTO> items = service.getAllByOrder(orderId, pageable).map(OrderItemResponseDTO::from);

        return ResponseEntity.ok(ApiResponse.success("Itens do pedido obtidos com sucesso", items));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<Page<OrderItemResponseDTO>>> getAllByProduct(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderItemResponseDTO> items = service.getAllByProduct(productId, pageable).map(OrderItemResponseDTO::from);

        return ResponseEntity.ok(ApiResponse.success("Itens do produto obtidos com sucesso", items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderItemResponseDTO>> getById(@PathVariable UUID id) {
        OrderItem item = service.getById(id);

        return ResponseEntity.ok(ApiResponse.success("Item obtido com sucesso", OrderItemResponseDTO.from(item)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);

        return ResponseEntity.ok(ApiResponse.success("Item deletado com sucesso", null));
    }
}
