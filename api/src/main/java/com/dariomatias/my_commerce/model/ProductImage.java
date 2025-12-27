package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
        name = "product_images",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_product_image_position",
                        columnNames = {"product_id", "position"}
                )
        }
)
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @Getter
    @Setter
    private Product product;

    @Column(nullable = false)
    @Getter
    @Setter
    private String url;

    @Column(nullable = false)
    @Getter
    @Setter
    private Integer position;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Transient
    @Setter
    private UUID productId;

    public ProductImage() {}

    public UUID getProductId() {
        return product != null ? product.getId() : productId;
    }
}
