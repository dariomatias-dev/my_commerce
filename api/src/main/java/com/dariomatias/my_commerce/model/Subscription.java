package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan plan;

    @Getter
    @Setter
    @Column(nullable = false)
    private LocalDateTime startDate;

    @Getter
    @Setter
    @Column(nullable = false)
    private LocalDateTime endDate;

    @Getter
    @Setter
    @Column(nullable = false)
    private Boolean isActive;

    @Getter
    @Setter
    @Embedded
    private AuditMetadata audit = new AuditMetadata();

    @Setter
    @Transient
    private UUID userId;

    @Setter
    @Transient
    private UUID planId;

    public Subscription() {}

    public UUID getUserId() {
        return user != null ? user.getId() : userId;
    }

    public UUID getPlanId() {
        return plan != null ? plan.getId() : planId;
    }
}
