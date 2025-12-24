package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.TransactionStatus;
import com.dariomatias.my_commerce.model.Transaction;
import com.dariomatias.my_commerce.repository.contract.TransactionContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class TransactionJdbcRepository implements TransactionContract {

    private final NamedParameterJdbcTemplate jdbc;

    public TransactionJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Transaction> mapper = this::mapRow;

    private Transaction mapRow(ResultSet rs, int rowNum) throws SQLException {
        Transaction transaction = new Transaction();
        transaction.setId(UUID.fromString(rs.getString("id")));
        transaction.setOrderId(UUID.fromString(rs.getString("order_id")));

        String payment = rs.getString("payment_method");
        transaction.setPaymentMethod(payment != null ? PaymentMethod.valueOf(payment) : null);

        transaction.setAmount(rs.getBigDecimal("amount"));

        String status = rs.getString("status");
        transaction.setStatus(status != null ? TransactionStatus.valueOf(status) : TransactionStatus.PENDING);

        transaction.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        transaction.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return transaction;
    }

    @Override
    public Transaction save(Transaction transaction) {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        transaction.setId(id);
        transaction.getAudit().setCreatedAt(now);
        transaction.getAudit().setUpdatedAt(now);

        String sql = """
            INSERT INTO transactions (id, order_id, payment_method, amount, status, created_at, updated_at)
            VALUES (:id, :order_id, :payment_method, :amount, :status, :created_at, :updated_at)
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("order_id", transaction.getOrderId())
                .addValue("payment_method", transaction.getPaymentMethod() != null ? transaction.getPaymentMethod().name() : null)
                .addValue("amount", transaction.getAmount())
                .addValue("status", transaction.getStatus() != null ? transaction.getStatus().name() : null)
                .addValue("created_at", now)
                .addValue("updated_at", now));

        return transaction;
    }

    @Override
    public Page<Transaction> findAll(Pageable pageable) {
        String sql = """
            SELECT * FROM transactions
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Transaction> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM transactions",
                new MapSqlParameterSource(),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Transaction> findAllByOrderUserId(UUID userId, Pageable pageable) {
        String sql = """
        SELECT t.*
        FROM transactions t
        INNER JOIN orders o ON t.order_id = o.id
        WHERE o.user_id = :user_id
        ORDER BY t.created_at DESC
        OFFSET :offset LIMIT :limit
    """;

        List<Transaction> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("user_id", userId)
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        String countSql = """
        SELECT COUNT(*)
        FROM transactions t
        INNER JOIN orders o ON t.order_id = o.id
        WHERE o.user_id = :user_id
    """;

        long total = jdbc.queryForObject(
                countSql,
                new MapSqlParameterSource("user_id", userId),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Transaction> findAllByOrderId(UUID orderId, Pageable pageable) {
        String sql = """
            SELECT * FROM transactions
            WHERE order_id = :order_id
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Transaction> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("order_id", orderId)
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM transactions WHERE order_id = :order_id",
                new MapSqlParameterSource("order_id", orderId),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<Transaction> findById(UUID id) {
        String sql = "SELECT * FROM transactions WHERE id = :id";

        List<Transaction> list = jdbc.query(sql,
                new MapSqlParameterSource("id", id),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Transaction update(Transaction transaction) {
        LocalDateTime now = LocalDateTime.now();
        transaction.getAudit().setUpdatedAt(now);

        String sql = """
            UPDATE transactions SET
                payment_method = :payment_method,
                amount = :amount,
                status = :status,
                updated_at = :updated_at
            WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", transaction.getId())
                .addValue("payment_method", transaction.getPaymentMethod() != null ? transaction.getPaymentMethod().name() : null)
                .addValue("amount", transaction.getAmount())
                .addValue("status", transaction.getStatus() != null ? transaction.getStatus().name() : null)
                .addValue("updated_at", now));

        return transaction;
    }

    @Override
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM transactions WHERE id = :id",
                new MapSqlParameterSource("id", id));
    }
}
