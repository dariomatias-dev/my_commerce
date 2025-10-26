package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    Page<Transaction> findAllByOrder(Order order, Pageable pageable);
}
