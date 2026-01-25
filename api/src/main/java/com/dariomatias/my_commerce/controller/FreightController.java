package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.freight.FreightResponseDTO;
import com.dariomatias.my_commerce.service.FreightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/freight")
@Tag(
        name = "Freight",
        description = "Endpoints for freight and shipping cost calculation"
)
public class FreightController {

    private final FreightService freightService;

    public FreightController(FreightService freightService) {
        this.freightService = freightService;
    }

    @Operation(
            summary = "Calculate freight",
            description = "Calculates the shipping cost based on the user's address identifier."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Freight calculated successfully",
                    content = @Content(schema = @Schema(implementation = FreightResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "User address not found"),
            @ApiResponse(responseCode = "400", description = "Invalid address data")
    })
    @GetMapping("/{userAddressId}")
    public ResponseEntity<ApiResult<FreightResponseDTO>> calculateFreight(
            @PathVariable UUID userAddressId
    ) {
        FreightResponseDTO freight = freightService.calculateFreight(userAddressId);

        return ResponseEntity.ok(
                ApiResult.success("Frete calculado com sucesso", freight)
        );
    }
}
