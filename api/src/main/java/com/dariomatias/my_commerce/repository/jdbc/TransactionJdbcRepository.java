package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.TransactionStatus;
import com.dariomatias.my_commerce.model.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class TransactionJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Transaction> rowMapper = this::mapTransaction;

    private Transaction mapTransaction(ResultSet rs, int rowNum) throws SQLException {
        Transaction transaction = new Transaction();
        transaction.setId(UUID.fromString(rs.getString("id")));
        transaction.setOrderId(UUID.fromString(rs.getString("order_id")));

        String paymentStr = rs.getString("payment_method");
        transaction.setPaymentMethod(paymentStr != null ? PaymentMethod.valueOf(paymentStr) : null);

        transaction.setAmount(rs.getBigDecimal("amount"));

        String statusStr = rs.getString("status");
        transaction.setStatus(statusStr != null ? TransactionStatus.valueOf(statusStr) : TransactionStatus.PENDING);

        transaction.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        transaction.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        return transaction;
    }

    public Transaction save(Transaction transaction) {
        if (transaction.getId() == null) transaction.setId(UUID.randomUUID());
        LocalDateTime now = LocalDateTime.now();
        transaction.getAudit().setCreatedAt(now);
        transaction.getAudit().setUpdatedAt(now);

        String sql = "INSERT INTO transactions (id, order_id, payment_method, amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                transaction.getId(),
                transaction.getOrderId(),
                transaction.getPaymentMethod() != null ? transaction.getPaymentMethod().name() : null,
                transaction.getAmount(),
                transaction.getStatus() != null ? transaction.getStatus().name() : null,
                transaction.getAudit().getCreatedAt(),
                transaction.getAudit().getUpdatedAt()
        );

        return transaction;
    }

    public void update(Transaction transaction) {
        transaction.getAudit().setUpdatedAt(LocalDateTime.now());
        String sql = "UPDATE transactions SET payment_method = ?, amount = ?, status = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                transaction.getPaymentMethod() != null ? transaction.getPaymentMethod().name() : null,
                transaction.getAmount(),
                transaction.getStatus() != null ? transaction.getStatus().name() : null,
                transaction.getAudit().getUpdatedAt(),
                transaction.getId()
        );
    }

    public void delete(UUID id) {
        jdbcTemplate.update("DELETE FROM transactions WHERE id = ?", id);
    }

    public Optional<Transaction> findById(UUID id) {
        String sql = "SELECT * FROM transactions WHERE id = ?";
        List<Transaction> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<Transaction> findAll(int offset, int limit) {
        String sql = "SELECT * FROM transactions ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, limit, offset);
    }

    public List<Transaction> findAllByOrderId(UUID orderId, int offset, int limit) {
        String sql = "SELECT * FROM transactions WHERE order_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, orderId, limit, offset);
    }
}
