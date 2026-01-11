package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.dto.user.AdminUserResponse;
import com.dariomatias.my_commerce.dto.user.UserFilterDTO;
import com.dariomatias.my_commerce.dto.user.UserRequest;
import com.dariomatias.my_commerce.dto.user.UserResponse;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.UserService;
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
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getAll(
            UserFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "audit.createdAt")
        );

        Page<AdminUserResponse> users = userService
                .getAll(filter, pageable)
                .map(AdminUserResponse::from);

        return ResponseEntity.ok(
                ApiResponse.success("Usuários obtidos com sucesso.", users)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getUserById(
            @PathVariable UUID id
    ) {
        User user = userService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Usuário obtido com sucesso.", AdminUserResponse.from(user))
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUser(
            @PathVariable UUID id,
            @RequestBody UserRequest updatedUser
    ) {
        User user = userService.update(id, updatedUser);

        return ResponseEntity.ok(
                ApiResponse.success("Usuário atualizado com sucesso.", AdminUserResponse.from(user))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable UUID id
    ) {
        userService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success("Usuário excluído com sucesso", null)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal User user
    ) {
        User currentUser = userService.getById(user.getId());

        return ResponseEntity.ok(
                ApiResponse.success("Usuário obtido com sucesso.", UserResponse.from(currentUser))
        );
    }

    @GetMapping("/stats/active-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getActiveUsersCount() {
        long activeUsers = userService.getActiveUsersCount();

        return ResponseEntity.ok(
                ApiResponse.success("Quantidade de usuários ativos", activeUsers)
        );
    }

    @GetMapping("/stats/new-users-this-month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getNewActiveUsersThisMonth() {
        long newUsers = userService.getNewActiveUsersSinceStartOfMonth();

        return ResponseEntity.ok(
                ApiResponse.success("Quantidade de novos usuários ativos desde o início do mês", newUsers)
        );
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @AuthenticationPrincipal User user,
            @RequestBody UserRequest updatedUser
    ) {
        User updated = userService.update(user.getId(), updatedUser);

        return ResponseEntity.ok(
                ApiResponse.success("Usuário atualizado com sucesso.", UserResponse.from(updated))
        );
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody PasswordUpdateRequest request
    ) {
        userService.changePassword(user.getId(), request);

        return ResponseEntity.ok(
                ApiResponse.success("Senha atualizada com sucesso", null)
        );
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentUser(
            @AuthenticationPrincipal User user
    ) {
        userService.delete(user.getId());

        return ResponseEntity.ok(
                ApiResponse.success("Usuário excluído com sucesso", null)
        );
    }
}
