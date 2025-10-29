package com.dariomatias.my_commerce.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "store_id")
    private Store store;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Getter
    @Setter
    @Column(nullable = false)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Getter
    @Setter
    @Column(nullable = false)
    private Double price;

    @Getter
    @Setter
    @Column(nullable = false)
    private Integer stock;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean active;

    @Getter
    @Setter
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;

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

    @Setter
    @Transient
    private UUID storeId;

    @Setter
    @Transient
    private UUID categoryId;

    public Product() {}

    public UUID getStoreId() {
        return store != null ? store.getId() : storeId;
    }

    public UUID getCategoryId() {
        return category != null ? category.getId() : categoryId;
    }
}
