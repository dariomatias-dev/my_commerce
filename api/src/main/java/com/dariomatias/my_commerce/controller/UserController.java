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
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Usuários obtidos com sucesso.", users));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal User user) {
        User currentUser = userService.getUserById(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Usuário obtido com sucesso.", currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("Usuário obtido com sucesso.", user));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateCurrentUser(@AuthenticationPrincipal User user,
                                                               @RequestBody User updatedUser) {
        User updated = userService.updateUser(user.getId(), updatedUser);
        return ResponseEntity.ok(ApiResponse.success("Usuário atualizado com sucesso.", updated));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable UUID id,
                                                        @RequestBody User updatedUser) {
        User updated = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(ApiResponse.success("Usuário atualizado com sucesso.", updated));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentUser(@AuthenticationPrincipal User user) {
        userService.deleteUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Usuário excluído com sucesso", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Usuário excluído com sucesso", null));
    }
}
