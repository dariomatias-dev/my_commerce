package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stores")
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

    @Column(nullable = false, unique = true)
    @Getter
    @Setter
    private String slug;

    @Getter
    @Setter
    @Column(nullable = false)
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
    @JoinColumn(name = "user_id")
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
        this.deletedAt = LocalDateTime.now();
        this.isActive = false;
        this.name = "Deleted Store";
        this.slug = UUID.randomUUID().toString();
        this.description = "";
        this.themeColor = "";
    }
}
