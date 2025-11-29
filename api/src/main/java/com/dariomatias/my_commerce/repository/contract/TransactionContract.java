package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface TransactionContract {

    Transaction save(Transaction transaction);

    Optional<Transaction> findById(UUID id);

    Page<Transaction> findAll(Pageable pageable);

    Page<Transaction> findAllByOrderId(UUID orderId, Pageable pageable);

    Transaction update(Transaction transaction);

    void deleteById(UUID id);
}
