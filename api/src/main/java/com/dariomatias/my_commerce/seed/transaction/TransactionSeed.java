package com.dariomatias.my_commerce.seed.transaction;

import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.TransactionStatus;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Transaction;
import com.dariomatias.my_commerce.repository.OrderRepository;
import com.dariomatias.my_commerce.repository.TransactionRepository;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Component
public class TransactionSeed {

    private final TransactionRepository transactionRepository;
    private final OrderRepository orderRepository;
    private final Random random = new Random();

    public TransactionSeed(TransactionRepository transactionRepository, OrderRepository orderRepository) {
        this.transactionRepository = transactionRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public void createTransactions() {
        List<Order> orders = orderRepository.findAll();
        if (orders.isEmpty()) return;

        PaymentMethod[] paymentMethods = PaymentMethod.values();
        TransactionStatus[] statuses = TransactionStatus.values();

        for (int i = 1; i <= 50; i++) {
            Order order = orders.get(random.nextInt(orders.size()));

            Transaction transaction = new Transaction();
            transaction.setOrder(order);
            transaction.setPaymentMethod(paymentMethods[random.nextInt(paymentMethods.length)]);
            transaction.setAmount(BigDecimal.valueOf(random.nextDouble() * 500 + 50));
            transaction.setStatus(statuses[random.nextInt(statuses.length)]);

            transactionRepository.save(transaction);
        }
    }
}
