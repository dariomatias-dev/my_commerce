package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @Column(nullable = false, unique = true)
    @Getter
    @Setter
    private String name;

    @Column(nullable = false)
    @Getter
    @Setter
    private Integer maxStores;

    @Column(nullable = false)
    @Getter
    @Setter
    private Integer maxProducts;

    @Column(columnDefinition = "TEXT")
    @Getter
    @Setter
    private String features;

    @Column(nullable = false)
    @Getter
    @Setter
    private BigDecimal price;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    public SubscriptionPlan() {}
}
