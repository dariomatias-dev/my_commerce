package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.address.UserAddressRequestDTO;
import com.dariomatias.my_commerce.dto.address.UserAddressResponseDTO;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.UserAddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
public class UserAddressController {

    private final UserAddressService service;

    public UserAddressController(UserAddressService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserAddressResponseDTO>> create(
            @AuthenticationPrincipal User user,
            @RequestBody UserAddressRequestDTO request
    ) {
        UserAddressResponseDTO userAddress = service.create(user, request);

        return ResponseEntity.ok(
                ApiResponse.success("Endereço criado com sucesso.", userAddress)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserAddressResponseDTO>>> getAll(
            @AuthenticationPrincipal User user
    ) {
        List<UserAddressResponseDTO> userAddresses = service.getAllByUser(user);

        return ResponseEntity.ok(
                ApiResponse.success("Endereços obtidos com sucesso.", userAddresses)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserAddressResponseDTO>> update(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @RequestBody UserAddressRequestDTO request
    ) {
        UserAddressResponseDTO userAddress = service.update(user, id, request);

        return ResponseEntity.ok(
                ApiResponse.success("Endereço atualizado com sucesso.", userAddress)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id
    ) {
        service.delete(user, id);

        return ResponseEntity.ok(
                ApiResponse.success("Endereço excluído com sucesso.", null)
        );
    }
}
