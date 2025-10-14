package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        ApiResponse<List<User>> response = userService.getAllUsers();
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal User user) {
        ApiResponse<User> response = userService.getUserById(user.getId());
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable UUID id) {
        ApiResponse<User> response = userService.getUserById(id);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateCurrentUser(@AuthenticationPrincipal User user, @RequestBody User updatedUser) {
        ApiResponse<User> response = userService.updateUser(user.getId(), updatedUser);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable UUID id, @RequestBody User updatedUser) {
        ApiResponse<User> response = userService.updateUser(id, updatedUser);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentUser(@AuthenticationPrincipal User user) {
        ApiResponse<Void> response = userService.deleteUser(user.getId());
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        ApiResponse<Void> response = userService.deleteUser(id);
        return ResponseEntity.status(response.getCode()).body(response);
    }
}
