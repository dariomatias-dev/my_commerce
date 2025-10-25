package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class OrderJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public OrderJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Order> rowMapper = this::mapOrder;

    private Order mapOrder(ResultSet rs, int rowNum) throws SQLException {
        Order order = new Order();
        order.setId(UUID.fromString(rs.getString("id")));
        order.setTotalAmount(rs.getBigDecimal("total_amount"));
        order.setStatus(rs.getString("status"));
        order.setShippingAddress(rs.getString("shipping_address"));
        order.setShippingMethod(rs.getString("shipping_method"));
        order.setShippingCost(rs.getBigDecimal("shipping_cost"));
        order.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        order.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        Store store = new Store();
        store.setId(UUID.fromString(rs.getString("store_id")));
        order.setStore(store);

        User user = new User();
        user.setId(UUID.fromString(rs.getString("user_id")));
        order.setUser(user);

        return order;
    }

    public Order save(Order order) {
        if (order.getId() == null) order.setId(UUID.randomUUID());
        String sql = "INSERT INTO orders (id, store_id, user_id, total_amount, status, shipping_address, shipping_method, shipping_cost, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        jdbcTemplate.update(sql,
                order.getId(),
                order.getStore().getId(),
                order.getUser().getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getShippingMethod(),
                order.getShippingCost()
        );
        return order;
    }

    public Optional<Order> findById(UUID id) {
        String sql = "SELECT * FROM orders WHERE id = ?";
        List<Order> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<Order> findAllByStoreId(UUID storeId, int offset, int limit) {
        String sql = "SELECT * FROM orders WHERE store_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, storeId, limit, offset);
    }

    public List<Order> findAllByUserId(UUID userId, int offset, int limit) {
        String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, userId, limit, offset);
    }

    public List<Order> findAll(int offset, int limit) {
        String sql = "SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, limit, offset);
    }

    public void update(Order order) {
        String sql = "UPDATE orders SET total_amount = ?, status = ?, shipping_address = ?, shipping_method = ?, shipping_cost = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql,
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getShippingMethod(),
                order.getShippingCost(),
                order.getId()
        );
    }

    public void deleteById(UUID id) {
        String sql = "DELETE FROM orders WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
