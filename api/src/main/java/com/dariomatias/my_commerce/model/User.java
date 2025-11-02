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

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Getter
    @Setter
    @Column(nullable = false)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String email;

    @Getter
    @Setter
    @Column(nullable = false)
    private String password;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    @Getter
    @Setter
    @Column(nullable = false)
    private boolean enabled = false;

    @Getter
    @Setter
    @Embedded
    private AuditMetadata audit = new AuditMetadata();

    @Getter
    @Setter
    @Column
    private LocalDateTime deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public void delete() {
        this.deletedAt = LocalDateTime.now();
        this.enabled = false;
        this.name = "Deleted User";
        this.email = UUID.randomUUID() + "@deleted.com";
        this.password = new BCryptPasswordEncoder().encode(UUID.randomUUID().toString());
    }
}
