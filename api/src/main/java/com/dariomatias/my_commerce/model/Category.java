package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "store_id")
    @Getter
    @Setter
    private Store store;

    @Column(nullable = false)
    @Getter
    @Setter
    private String name;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Transient
    @Setter
    private UUID storeId;

    public Category() {}

    public UUID getStoreId() {
        return store != null ? store.getId() : storeId;
    }
}
