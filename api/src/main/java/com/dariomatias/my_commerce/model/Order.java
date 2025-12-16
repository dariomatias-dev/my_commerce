package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

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
    @JoinColumn(name = "user_id")
    @Getter
    @Setter
    private User user;

    @Column(nullable = false)
    @Getter
    @Setter
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 20)
    @Getter
    @Setter
    private String status = "PENDING";

    @OneToMany(
            mappedBy = "order",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Getter
    @Setter
    private List<OrderItem> items;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Transient
    @Setter
    private UUID storeId;

    @Transient
    @Setter
    private UUID userId;

    public Order() {}

    public UUID getStoreId() {
        return store != null ? store.getId() : storeId;
    }

    public UUID getUserId() {
        return user != null ? user.getId() : userId;
    }
}
