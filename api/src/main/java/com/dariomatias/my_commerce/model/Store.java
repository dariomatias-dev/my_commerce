package com.dariomatias.my_commerce.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
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
    private Boolean isActive;

    @Getter
    @Setter
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Setter
    @Transient
    private UUID ownerId;

    public Store() {}

    public UUID getOwnerId() {
        return owner != null ? owner.getId() : ownerId;
    }
}
