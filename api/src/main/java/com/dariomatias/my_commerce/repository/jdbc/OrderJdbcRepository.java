package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.*;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class OrderJdbcRepository implements OrderContract {

    private final NamedParameterJdbcTemplate jdbc;

    public OrderJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Order> mapper = (rs, rowNum) -> {
        Order order = new Order();
        order.setId(UUID.fromString(rs.getString("id")));
        order.setTotalAmount(rs.getBigDecimal("total_amount"));
        order.setStatus(rs.getString("status"));
        order.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        order.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        Store store = new Store();
        store.setId(UUID.fromString(rs.getString("store_id")));
        order.setStore(store);

        User user = new User();
        user.setId(UUID.fromString(rs.getString("user_id")));
        order.setUser(user);

        return order;
    };

    @Override
    public Order save(Order order) {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        order.setId(id);
        order.getAudit().setCreatedAt(now);
        order.getAudit().setUpdatedAt(now);

        String sql = """
            INSERT INTO orders (id, store_id, user_id, total_amount, status, created_at, updated_at)
            VALUES (:id, :store_id, :user_id, :total_amount, :status, :created_at, :updated_at)
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("store_id", order.getStore().getId())
                .addValue("user_id", order.getUser().getId())
                .addValue("total_amount", order.getTotalAmount())
                .addValue("status", order.getStatus())
                .addValue("created_at", now)
                .addValue("updated_at", now));

        return order;
    }

    @Override
    public Page<Order> findAll(Pageable pageable) {
        String sql = """
            SELECT * FROM orders
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Order> content = jdbc.query(sql, new MapSqlParameterSource()
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize()), mapper);

        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM orders", new MapSqlParameterSource(), Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Order> findAllByStoreId(UUID storeId, Pageable pageable) {

        String sql = """
            SELECT * FROM orders
            WHERE store_id = :store_id
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Order> content = jdbc.query(sql, new MapSqlParameterSource()
                .addValue("store_id", storeId)
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize()), mapper);

        Long total = jdbc.queryForObject("""
                SELECT COUNT(*) FROM orders WHERE store_id = :store_id
                """, new MapSqlParameterSource("store_id", storeId), Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Order> findAllByUserId(UUID userId, Pageable pageable) {

        String sql = """
            SELECT * FROM orders
            WHERE user_id = :user_id
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Order> content = jdbc.query(sql, new MapSqlParameterSource()
                .addValue("user_id", userId)
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize()), mapper);

        Long total = jdbc.queryForObject("""
                SELECT COUNT(*) FROM orders WHERE user_id = :user_id
                """, new MapSqlParameterSource("user_id", userId), Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<Order> findById(UUID id) {
        List<Order> list = jdbc.query(
                "SELECT * FROM orders WHERE id = :id",
                new MapSqlParameterSource("id", id),
                mapper
        );

        return list.stream().findFirst();
    }

    @Override
    public Order update(Order order) {
        LocalDateTime now = LocalDateTime.now();
        order.getAudit().setUpdatedAt(now);

        String sql = """
            UPDATE orders
               SET total_amount = :total_amount,
                   status       = :status,
                   updated_at   = :updated_at
             WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", order.getId())
                .addValue("total_amount", order.getTotalAmount())
                .addValue("status", order.getStatus())
                .addValue("updated_at", now));

        return order;
    }

    @Override
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM orders WHERE id = :id",
                new MapSqlParameterSource("id", id));
    }
}
