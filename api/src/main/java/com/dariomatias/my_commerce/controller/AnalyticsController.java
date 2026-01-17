package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.analytics.TotalRevenueResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.UniqueCustomersResponseDTO;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/me/stats/unique-customers")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<UniqueCustomersResponseDTO>> getUniqueCustomers(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("Clientes únicos", service.getUniqueCustomers(user.getId()))
        );
    }

    @GetMapping("/me/stats/total-revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<TotalRevenueResponseDTO>> getTotalRevenue(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("Receita total", service.getTotalRevenue(user.getId()))
        );
    }

    @GetMapping("/store/{storeId}/stats/unique-customers")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<UniqueCustomersResponseDTO>> getUniqueCustomersByStore(
            @PathVariable UUID storeId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("Clientes únicos da loja", service.getUniqueCustomersByStore(storeId))
        );
    }

    @GetMapping("/store/{storeId}/stats/total-revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUBSCRIBER')")
    public ResponseEntity<ApiResponse<TotalRevenueResponseDTO>> getTotalRevenueByStore(
            @PathVariable UUID storeId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("Receita total da loja",service.getTotalRevenueByStore(storeId))
        );
    }

    @GetMapping("/total-revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TotalRevenueResponseDTO>> getTotalRevenue() {
        BigDecimal totalRevenue = service.getTotalRevenue();

        return ResponseEntity.ok(
                ApiResponse.success("Receita total geral", new TotalRevenueResponseDTO(totalRevenue))
        );
    }
}
