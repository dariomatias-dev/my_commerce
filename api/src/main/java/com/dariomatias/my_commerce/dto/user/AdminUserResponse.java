package com.dariomatias.my_commerce.dto.user;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class AdminUserResponse {

    private UUID id;
    private String name;
    private String email;
    private UserRole role;
    private boolean enabled;
    private LocalDateTime createdAt;

    public AdminUserResponse(UUID id, String name, String email, UserRole role, boolean enabled, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.getAudit().getCreatedAt()
        );
    }

}
