package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.address.UserAddressRequestDTO;
import com.dariomatias.my_commerce.dto.address.UserAddressResponseDTO;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.UserAddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
@Tag(
        name = "User Addresses",
        description = "Endpoints for managing user addresses"
)
public class UserAddressController {

    private final UserAddressService service;

    public UserAddressController(UserAddressService service) {
        this.service = service;
    }

    @Operation(summary = "Create address", description = "Creates a new address for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Address created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    @PostMapping
    public ResponseEntity<ApiResult<UserAddressResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestBody UserAddressRequestDTO request
    ) {

        UserAddressResponseDTO userAddress = service.create(user, request);

        return ResponseEntity.ok(
                ApiResult.success("Endereço criado com sucesso.", userAddress)
        );
    }

    @Operation(summary = "List all addresses", description = "Returns a list of all addresses for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Addresses retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<ApiResult<List<UserAddressResponseDTO>>> getAll(
            @AuthenticationPrincipal User user
    ) {

        List<UserAddressResponseDTO> userAddresses = service.getAllByUser(user);

        return ResponseEntity.ok(
                ApiResult.success("Endereços obtidos com sucesso.", userAddresses)
        );
    }

    @Operation(summary = "Update address", description = "Updates an existing address by its ID for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Address updated successfully"),
            @ApiResponse(responseCode = "404", description = "Address not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<UserAddressResponseDTO>> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestBody UserAddressRequestDTO request
    ) {

        UserAddressResponseDTO userAddress = service.update(user, id, request);

        return ResponseEntity.ok(
                ApiResult.success("Endereço atualizado com sucesso.", userAddress)
        );
    }

    @Operation(summary = "Delete address", description = "Deletes an address by its ID for the authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Address deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Address not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {

        service.delete(user, id);

        return ResponseEntity.ok(
                ApiResult.success("Endereço excluído com sucesso.", null)
        );
    }
}
