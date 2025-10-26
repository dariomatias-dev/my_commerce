package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Transaction;
import com.dariomatias.my_commerce.repository.OrderRepository;
import com.dariomatias.my_commerce.repository.TransactionRepository;
import com.dariomatias.my_commerce.repository.jdbc.TransactionJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Component
public class TransactionAdapter {

    private final TransactionRepository transactionRepository;
    private final TransactionJdbcRepository transactionJdbcRepository;
    private final OrderRepository orderRepository;
    private final boolean useJdbc;

    public TransactionAdapter(TransactionRepository transactionRepository,
                              TransactionJdbcRepository transactionJdbcRepository,
                              OrderRepository orderRepository,
                              @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.transactionRepository = transactionRepository;
        this.transactionJdbcRepository = transactionJdbcRepository;
        this.orderRepository = orderRepository;
        this.useJdbc = useJdbc;
    }

    public Transaction save(Transaction transaction) {
        if (transaction.getOrder() == null && transaction.getOrderId() != null) {
            Order order = orderRepository.findById(transaction.getOrderId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
            transaction.setOrder(order);
        }
        return useJdbc ? transactionJdbcRepository.save(transaction) : transactionRepository.save(transaction);
    }

    public Transaction update(Transaction transaction) {
        if (useJdbc) transactionJdbcRepository.update(transaction);
        else transactionRepository.save(transaction);
        return transaction;
    }

    public void delete(UUID id) {
        if (useJdbc) transactionJdbcRepository.delete(id);
        else transactionRepository.deleteById(id);
    }

    public Transaction findById(UUID id) {
        return useJdbc
                ? transactionJdbcRepository.findById(id).orElse(null)
                : transactionRepository.findById(id).orElse(null);
    }

    public Page<Transaction> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Transaction> list = transactionJdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return transactionRepository.findAll(pageable);
        }
    }

    public Page<Transaction> findAllByOrder(UUID orderId, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Transaction> list = transactionJdbcRepository.findAllByOrderId(orderId, offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            Order order = new Order();
            order.setId(orderId);
            return transactionRepository.findAllByOrder(order, pageable);
        }
    }
}
