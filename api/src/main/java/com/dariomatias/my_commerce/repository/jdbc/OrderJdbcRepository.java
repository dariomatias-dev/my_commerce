package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class OrderJdbcRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public OrderJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Order> rowMapper = (rs, rowNum) -> {
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

    public Order save(Order order) {
        UUID id = order.getId() != null ? order.getId() : UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            INSERT INTO orders (id, store_id, user_id, total_amount, status, created_at, updated_at)
            VALUES (:id, :store_id, :user_id, :total_amount, :status, :created_at, :updated_at)
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("store_id", order.getStore().getId())
                .addValue("user_id", order.getUser().getId())
                .addValue("total_amount", order.getTotalAmount())
                .addValue("status", order.getStatus())
                .addValue("created_at", now)
                .addValue("updated_at", now);

        jdbc.update(sql, params);

        order.setId(id);
        order.getAudit().setCreatedAt(now);
        order.getAudit().setUpdatedAt(now);
        return order;
    }

    public Optional<Order> findById(UUID id) {
        String sql = "SELECT * FROM orders WHERE id = :id";
        List<Order> list = jdbc.query(sql, new MapSqlParameterSource("id", id), rowMapper);
        return list.stream().findFirst();
    }

    public List<Order> findAll(int offset, int limit) {
        String sql = "SELECT * FROM orders ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("offset", offset)
                .addValue("limit", limit), rowMapper);
    }

    public List<Order> findAllByStoreId(UUID storeId, int offset, int limit) {
        String sql = "SELECT * FROM orders WHERE store_id = :store_id ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("store_id", storeId)
                .addValue("offset", offset)
                .addValue("limit", limit), rowMapper);
    }

    public List<Order> findAllByUserId(UUID userId, int offset, int limit) {
        String sql = "SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("user_id", userId)
                .addValue("offset", offset)
                .addValue("limit", limit), rowMapper);
    }

    public void update(Order order) {
        LocalDateTime now = LocalDateTime.now();
        String sql = """
            UPDATE orders
            SET total_amount = :total_amount,
                status = :status,
                updated_at = :updated_at
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", order.getId())
                .addValue("total_amount", order.getTotalAmount())
                .addValue("status", order.getStatus())
                .addValue("updated_at", now);

        jdbc.update(sql, params);
        order.getAudit().setUpdatedAt(now);
    }

    public void deleteById(UUID id) {
        String sql = "DELETE FROM orders WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }
}
