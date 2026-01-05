package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import com.dariomatias.my_commerce.service.FreightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/freight")
public class FreightController {

    private final FreightService freightService;

    public FreightController(FreightService freightService) {
        this.freightService = freightService;
    }

    @GetMapping("/{userAddressId}")
    public ResponseEntity<ApiResponse<FreightResponseDTO>> calculateFreight(@PathVariable UUID userAddressId) {
        FreightResponseDTO freight = freightService.calculateFreight(userAddressId);

        return ResponseEntity.ok(ApiResponse.success("Frete calculado com sucesso", freight));
    }
}
