package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.transaction.TransactionRequestDTO;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Transaction;
import com.dariomatias.my_commerce.repository.contract.TransactionContract;
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

    private final TransactionContract transactionRepository;

    public TransactionService(TransactionContract transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction create(TransactionRequestDTO request) {
        if (request.getPaymentMethod() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Método de pagamento é obrigatório");

        Order order = new Order();
        order.setId(request.getOrderId());

        Transaction transaction = new Transaction();
        transaction.setOrder(order);
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setAmount(request.getAmount());

        return transactionRepository.save(transaction);
    }

    public Page<Transaction> getAll(Pageable pageable) {
        return transactionRepository.findAll(pageable);
    }

    public Page<Transaction> getAllByStoreSlug(String storeSlug, Pageable pageable) {
        return transactionRepository.findAllByOrderStoreSlug(storeSlug, pageable);
    }

    public Page<Transaction> getAllByUser(UUID userId, Pageable pageable) {
        return transactionRepository.findAllByOrderUserId(userId, pageable);
    }

    public Page<Transaction> getAllByOrder(UUID orderId, Pageable pageable) {
        return transactionRepository.findAllByOrderId(orderId, pageable);
    }

    public Transaction getById(UUID id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));
    }

    public Transaction update(UUID id, TransactionRequestDTO request) {
        Transaction transaction = getById(id);

        if (request.getPaymentMethod() != null)
            transaction.setPaymentMethod(request.getPaymentMethod());

        if (request.getAmount() != null)
            transaction.setAmount(request.getAmount());

        return transactionRepository.update(transaction);
    }

    public void delete(UUID id) {
        getById(id);
        transactionRepository.deleteById(id);
    }
}
