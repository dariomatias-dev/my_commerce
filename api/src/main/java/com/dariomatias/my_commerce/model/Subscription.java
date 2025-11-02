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
    @JoinColumn(name = "plan_id")
    @Getter
    @Setter
    private SubscriptionPlan plan;

    @Column(nullable = false)
    @Getter
    @Setter
    private LocalDateTime startDate;

    @Column(nullable = false)
    @Getter
    @Setter
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Getter
    @Setter
    private Boolean isActive;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Transient
    @Setter
    private UUID userId;

    @Transient
    @Setter
    private UUID planId;

    public Subscription() {}

    public UUID getUserId() {
        return user != null ? user.getId() : userId;
    }

    public UUID getPlanId() {
        return plan != null ? plan.getId() : planId;
    }
}
