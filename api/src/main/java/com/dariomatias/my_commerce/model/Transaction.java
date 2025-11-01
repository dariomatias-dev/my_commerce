package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.TransactionStatus;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Getter
    @Setter
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PaymentMethod paymentMethod;

    @Getter
    @Setter
    @Column(nullable = false)
    private BigDecimal amount;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Getter
    @Setter
    @Embedded
    private AuditMetadata audit = new AuditMetadata();

    @Setter
    @Transient
    private UUID orderId;

    public Transaction() {}

    public UUID getOrderId() {
        return order != null ? order.getId() : orderId;
    }
}
