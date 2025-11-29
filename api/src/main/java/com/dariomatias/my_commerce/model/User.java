package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @Column(nullable = false)
    @Getter
    @Setter
    private String name;

    @Column(nullable = false, unique = true)
    @Getter
    @Setter
    private String email;

    @Column(nullable = false)
    @Getter
    @Setter
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Getter
    @Setter
    private UserRole role = UserRole.USER;

    @Column(nullable = false)
    @Getter
    @Setter
    private boolean enabled = false;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Column
    @Getter
    @Setter
    private LocalDateTime deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public void delete() {
        this.enabled = false;
        this.deletedAt = LocalDateTime.now();
    }
}
