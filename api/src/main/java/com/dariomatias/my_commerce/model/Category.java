package com.dariomatias.my_commerce.model;

import jakarta.persistence.*;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category {

    @Setter
    @Id
    @GeneratedValue
    private UUID id;

    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "store_id")
    private Store store;

    @Setter
    @Column(nullable = false)
    private String name;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Category() {}

    public UUID getId() {
        return id;
    }

    public Store getStore() {
        return store;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
