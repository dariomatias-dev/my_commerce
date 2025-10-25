package com.dariomatias.my_commerce.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "favorites")
public class Favorite {

    @Getter @Setter
    @Id
    @GeneratedValue
    private UUID id;

    @Getter @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Getter @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Getter @Setter
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Setter
    @Transient
    private UUID userId;

    @Setter
    @Transient
    private UUID productId;

    public UUID getUserId() {
        return user != null ? user.getId() : userId;
    }

    public UUID getProductId() {
        return product != null ? product.getId() : productId;
    }
}
