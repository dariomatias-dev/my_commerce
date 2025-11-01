package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
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
    @Embedded
    private AuditMetadata audit = new AuditMetadata();

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
