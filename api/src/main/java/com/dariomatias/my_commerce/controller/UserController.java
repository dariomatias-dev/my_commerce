package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResult;
import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.dto.user.AdminUserResponse;
import com.dariomatias.my_commerce.dto.user.UserFilterDTO;
import com.dariomatias.my_commerce.dto.user.UserRequest;
import com.dariomatias.my_commerce.dto.user.UserResponse;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@Tag(name = "Users", description = "Operations related to user management")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "List all users",
            description = "Returns a paginated list of users with optional filters. Admin access only."
    )
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResult<Page<AdminUserResponse>>> getAll(
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
                ApiResult.success(
                        "Users retrieved successfully.",
                        users
                )
        );
    }

    @Operation(
            summary = "Get user by ID",
            description = "Returns a specific user by ID. Admin access only."
    )
    @ApiResponse(responseCode = "200", description = "User retrieved successfully")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<AdminUserResponse>> getUserById(
            @AuthenticationPrincipal User authenticatedUser,
            @PathVariable UUID id
    ) {
        User user = userService.getById(authenticatedUser, id);

        return ResponseEntity.ok(
                ApiResult.success(
                        "User retrieved successfully.",
                        AdminUserResponse.from(user)
                )
        );
    }

    @Operation(
            summary = "Update user by ID",
            description = "Updates an existing user. Admin access only."
    )
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResult<AdminUserResponse>> updateUser(
            @AuthenticationPrincipal User authenticatedUser,
            @PathVariable UUID id,
            @RequestBody UserRequest updatedUser
    ) {
        User user = userService.update(authenticatedUser, id, updatedUser);

        return ResponseEntity.ok(
                ApiResult.success(
                        "User updated successfully.",
                        AdminUserResponse.from(user)
                )
        );
    }

    @Operation(
            summary = "Delete user by ID",
            description = "Deletes a user by ID. Admin access only."
    )
    @ApiResponse(responseCode = "200", description = "User deleted successfully")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<Void>> deleteUser(
            @AuthenticationPrincipal User authenticatedUser,
            @PathVariable UUID id
    ) {
        userService.delete(authenticatedUser, id);

        return ResponseEntity.ok(
                ApiResult.success(
                        "User deleted successfully.",
                        null
                )
        );
    }

    @Operation(
            summary = "Get current authenticated user",
            description = "Returns the data of the currently authenticated user."
    )
    @ApiResponse(responseCode = "200", description = "User retrieved successfully")
    @GetMapping("/me")
    public ResponseEntity<ApiResult<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal User authenticatedUser
    ) {
        User currentUser = userService.getById(authenticatedUser, authenticatedUser.getId());

        return ResponseEntity.ok(
                ApiResult.success(
                        "User retrieved successfully.",
                        UserResponse.from(currentUser)
                )
        );
    }

    @Operation(
            summary = "Get active users count",
            description = "Returns the number of active users. Admin access only."
    )
    @ApiResponse(responseCode = "200", description = "Active users count retrieved successfully")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats/active-users")
    public ResponseEntity<ApiResult<Long>> getActiveUsersCount() {
        long activeUsers = userService.getActiveUsersCount();

        return ResponseEntity.ok(
                ApiResult.success(
                        "Active users count retrieved successfully.",
                        activeUsers
                )
        );
    }

    @Operation(
            summary = "Update current user",
            description = "Updates the currently authenticated user."
    )
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @PatchMapping("/me")
    public ResponseEntity<ApiResult<UserResponse>> updateCurrentUser(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody UserRequest updatedUser
    ) {
        User updated = userService.update(
                authenticatedUser,
                authenticatedUser.getId(),
                updatedUser
        );

        return ResponseEntity.ok(
                ApiResult.success(
                        "User updated successfully.",
                        UserResponse.from(updated)
                )
        );
    }

    @Operation(
            summary = "Change current user password",
            description = "Changes the password of the currently authenticated user."
    )
    @ApiResponse(responseCode = "200", description = "Password updated successfully")
    @PostMapping("/me/change-password")
    public ResponseEntity<ApiResult<Void>> changePassword(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestBody PasswordUpdateRequest request
    ) {
        userService.changePassword(
                authenticatedUser,
                authenticatedUser.getId(),
                request
        );

        return ResponseEntity.ok(
                ApiResult.success(
                        "Password updated successfully.",
                        null
                )
        );
    }

    @Operation(
            summary = "Delete current user",
            description = "Deletes the currently authenticated user."
    )
    @ApiResponse(responseCode = "200", description = "User deleted successfully")
    @DeleteMapping("/me")
    public ResponseEntity<ApiResult<Void>> deleteCurrentUser(
            @AuthenticationPrincipal User authenticatedUser
    ) {
        userService.delete(authenticatedUser, authenticatedUser.getId());

        return ResponseEntity.ok(
                ApiResult.success(
                        "User deleted successfully.",
                        null
                )
        );
    }
}
