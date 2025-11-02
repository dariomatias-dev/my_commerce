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

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter
    @Setter
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    @Getter
    @Setter
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Getter
    @Setter
    private PaymentMethod paymentMethod;

    @Column(nullable = false)
    @Getter
    @Setter
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Getter
    @Setter
    private TransactionStatus status = TransactionStatus.PENDING;

    @Embedded
    @Getter
    @Setter
    private AuditMetadata audit = new AuditMetadata();

    @Transient
    @Setter
    private UUID orderId;

    public Transaction() {}

    public UUID getOrderId() {
        return order != null ? order.getId() : orderId;
    }
}
