package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {

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

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    @Getter
    @Setter
    private Category category;

    @Column(nullable = false)
    @Getter
    @Setter
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Getter
    @Setter
    private String description;

    @Column(nullable = false)
    @Getter
    @Setter
    private Double price;

    @Column(nullable = false)
    @Getter
    @Setter
    private Integer stock;

    @Column(nullable = false)
    @Getter
    @Setter
    private Boolean active;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @Getter
    @Setter
    private List<String> images;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Transient
    @Setter
    private UUID storeId;

    @Transient
    @Setter
    private UUID categoryId;

    public Product() {}

    public UUID getStoreId() {
        return store != null ? store.getId() : storeId;
    }

    public UUID getCategoryId() {
        return category != null ? category.getId() : categoryId;
    }
}
