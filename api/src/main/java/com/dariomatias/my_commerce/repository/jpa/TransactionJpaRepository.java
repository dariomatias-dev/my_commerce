package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Transaction;
import com.dariomatias.my_commerce.repository.TransactionRepository;
import com.dariomatias.my_commerce.repository.contract.TransactionContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class TransactionJpaRepository implements TransactionContract {

    private final TransactionRepository repository;

    public TransactionJpaRepository(TransactionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Transaction save(Transaction transaction) {
        return repository.save(transaction);
    }

    @Override
    public Page<Transaction> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<Transaction> findAllByOrderId(UUID orderId, Pageable pageable) {
        Order order = new Order();
        order.setId(orderId);
        return repository.findAllByOrder(order, pageable);
    }

    @Override
    public Optional<Transaction> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Transaction update(Transaction transaction) {
        return repository.save(transaction);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
