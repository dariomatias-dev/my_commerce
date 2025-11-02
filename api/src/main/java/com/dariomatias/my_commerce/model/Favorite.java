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

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @Getter
    @Setter
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    @Getter
    @Setter
    private Product product;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    @Getter
    @Setter
    private LocalDateTime createdAt;

    @Transient
    @Setter
    private UUID userId;

    @Transient
    @Setter
    private UUID productId;

    public UUID getUserId() {
        return user != null ? user.getId() : userId;
    }

    public UUID getProductId() {
        return product != null ? product.getId() : productId;
    }
}
