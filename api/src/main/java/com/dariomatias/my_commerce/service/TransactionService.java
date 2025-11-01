package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.transaction.TransactionRequestDTO;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.model.Transaction;
import com.dariomatias.my_commerce.repository.adapter.TransactionAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@Transactional
public class TransactionService {

    private final TransactionAdapter transactionAdapter;

    public TransactionService(TransactionAdapter transactionAdapter) {
        this.transactionAdapter = transactionAdapter;
    }

    public Transaction create(TransactionRequestDTO request) {
        Transaction transaction = new Transaction();
        transaction.setOrderId(request.getOrderId());

        if (request.getPaymentMethod() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Método de pagamento é obrigatório");
        }

        transaction.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        transaction.setAmount(request.getAmount());

        return transactionAdapter.save(transaction);
    }

    public Page<Transaction> getAll(Pageable pageable) {
        return transactionAdapter.findAll(pageable);
    }

    public Page<Transaction> getAllByOrder(UUID orderId, Pageable pageable) {
        return transactionAdapter.findAllByOrder(orderId, pageable);
    }

    public Transaction getById(UUID id) {
        Transaction transaction = transactionAdapter.findById(id);
        if (transaction == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada");
        return transaction;
    }

    public Transaction update(UUID id, TransactionRequestDTO request) {
        Transaction transaction = getById(id);

        if (request.getPaymentMethod() != null) {
            transaction.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
        }

        if (request.getAmount() != null) {
            transaction.setAmount(request.getAmount());
        }

        return transactionAdapter.update(transaction);
    }

    public void delete(UUID id) {
        getById(id);
        transactionAdapter.delete(id);
    }
}
