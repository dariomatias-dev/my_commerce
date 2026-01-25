package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.order.OrderDetailsResponseDTO;
import com.dariomatias.my_commerce.dto.order.OrderRequestDTO;
import com.dariomatias.my_commerce.dto.order.OrderResponseDTO;
import com.dariomatias.my_commerce.dto.stores.StoreResponseDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "Orders",
        description = "Endpoints for managing customer orders"
)
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @Operation(
            summary = "Create order",
            description = "Creates a new order for the authenticated user."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Order created successfully",
                    content = @Content(schema = @Schema(implementation = OrderResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid order data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
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

    @Operation(
            summary = "List all orders",
            description = "Returns a paginated list of all orders. Admin access only."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Orders retrieved successfully",
                    content = @Content(schema = @Schema(implementation = OrderResponseDTO.class))
            ),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
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

    @Operation(
            summary = "List orders by user",
            description = "Returns a paginated list of orders for a specific user. Admin access only."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User orders retrieved successfully",
                    content = @Content(schema = @Schema(implementation = OrderResponseDTO.class))
            ),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
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

    @Operation(
            summary = "List orders by store",
            description = "Returns a paginated list of orders for a specific store."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Store orders retrieved successfully",
                    content = @Content(schema = @Schema(implementation = OrderResponseDTO.class))
            ),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
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

    @Operation(
            summary = "List my orders",
            description = "Returns a paginated list of orders for the authenticated user."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User orders retrieved successfully",
                    content = @Content(schema = @Schema(implementation = OrderResponseDTO.class))
            )
    })
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

    @Operation(
            summary = "List my stores with orders",
            description = "Returns a paginated list of stores where the authenticated user has placed orders."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Stores retrieved successfully",
                    content = @Content(schema = @Schema(implementation = StoreResponseDTO.class))
            )
    })
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

    @Operation(
            summary = "List my orders by store",
            description = "Returns a paginated list of orders for a specific store placed by the authenticated user."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Orders retrieved successfully",
                    content = @Content(schema = @Schema(implementation = OrderResponseDTO.class))
            )
    })
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

    @Operation(
            summary = "Get order by ID",
            description = "Returns detailed information about a specific order."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Order retrieved successfully",
                    content = @Content(schema = @Schema(implementation = OrderDetailsResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<OrderDetailsResponseDTO>> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                ApiResult.success("Pedido obtido com sucesso", service.getById(id, user))
        );
    }

    @Operation(
            summary = "Get successful sales count",
            description = "Returns the total number of successful sales for a specific store."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successful sales count retrieved"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
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

    @Operation(
            summary = "Delete order",
            description = "Deletes an order by its ID. Admin access only."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Order deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
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
