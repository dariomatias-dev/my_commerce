package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "stores",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"slug"}),
                @UniqueConstraint(columnNames = {"name"})
        }
)
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @Column(nullable = false)
    @Getter
    @Setter
    private String name;

    @Column(nullable = false)
    @Getter
    @Setter
    private String slug;

    @Column(nullable = false)
    @Getter
    @Setter
    private String description;

    @Column(nullable = false)
    @Getter
    @Setter
    private String themeColor;

    @Column(nullable = false)
    @Getter
    @Setter
    private Boolean isActive = true;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Column
    @Getter
    @Setter
    private LocalDateTime deletedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @Getter
    @Setter
    private User user;

    @Transient
    @Setter
    private UUID userId;

    public Store() {}

    public UUID getUserId() {
        return user != null ? user.getId() : userId;
    }

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public void delete() {
        this.isActive = false;
        this.deletedAt = LocalDateTime.now();
    }
}
