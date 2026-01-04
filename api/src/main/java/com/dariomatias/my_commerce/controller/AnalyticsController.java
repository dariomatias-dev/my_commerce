package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.analytics.ConversionRateResponseDTO;
import com.dariomatias.my_commerce.dto.analytics.VisitorsPerHourResponseDTO;
import com.dariomatias.my_commerce.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/store/{storeId}/stats/activity-log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VisitorsPerHourResponseDTO>>> getVisitorsPerHour(
            @PathVariable UUID storeId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Visitantes por hora (últimas 24h)",
                        service.getVisitorsPerHour(storeId)
                )
        );
    }

    @GetMapping("/store/{storeId}/stats/conversion-rate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ConversionRateResponseDTO>> getConversionRate(
            @PathVariable UUID storeId
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Taxa de conversão",
                        service.getConversionRate(storeId)
                )
        );
    }
}
