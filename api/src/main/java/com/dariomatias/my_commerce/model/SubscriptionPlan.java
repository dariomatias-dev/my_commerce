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

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Getter
    @Setter
    @Column(nullable = false, unique = true)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false)
    private Integer maxStores;

    @Getter
    @Setter
    @Column(nullable = false)
    private Integer maxProducts;

    @Getter
    @Setter
    @Column(columnDefinition = "TEXT")
    private String features;

    @Getter
    @Setter
    @Column(nullable = false)
    private BigDecimal price;

    @Getter
    @Setter
    @Embedded
    private AuditMetadata audit = new AuditMetadata();

    public SubscriptionPlan() {}
}
