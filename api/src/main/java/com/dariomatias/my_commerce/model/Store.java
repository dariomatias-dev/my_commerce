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
    private String slug;

    @Getter
    @Setter
    @Column(nullable = false)
    private String description;

    @Getter
    @Setter
    @Column(nullable = false)
    private String bannerUrl;

    @Getter
    @Setter
    @Column(nullable = false)
    private String logoUrl;

    @Getter
    @Setter
    @Column(nullable = false)
    private String themeColor;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean isActive = true;

    @Getter
    @Setter
    @Column
    private LocalDateTime deletedAt;

    @Getter
    @Setter
    @Embedded
    private AuditMetadata audit = new AuditMetadata();

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Setter
    @Transient
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
        this.bannerUrl = "";
        this.logoUrl = "";
        this.themeColor = "";
    }
}
