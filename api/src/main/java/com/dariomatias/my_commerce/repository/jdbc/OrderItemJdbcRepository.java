package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
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
public class OrderItemJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public OrderItemJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<OrderItem> rowMapper = this::mapOrderItem;

    private OrderItem mapOrderItem(ResultSet rs, int rowNum) throws SQLException {
        OrderItem item = new OrderItem();
        item.setId(UUID.fromString(rs.getString("id")));
        item.setQuantity(rs.getInt("quantity"));
        item.setPrice(rs.getBigDecimal("price"));
        item.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        item.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        Order order = new Order();
        order.setId(UUID.fromString(rs.getString("order_id")));
        item.setOrder(order);

        Product product = new Product();
        product.setId(UUID.fromString(rs.getString("product_id")));
        item.setProduct(product);

        return item;
    }

    public OrderItem save(OrderItem item) {
        if (item.getId() == null) {
            item.setId(UUID.randomUUID());
        }
        LocalDateTime now = LocalDateTime.now();
        item.getAudit().setCreatedAt(now);
        item.getAudit().setUpdatedAt(now);

        String sql = "INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                item.getId(),
                item.getOrder().getId(),
                item.getProduct().getId(),
                item.getQuantity(),
                item.getPrice(),
                item.getAudit().getCreatedAt(),
                item.getAudit().getUpdatedAt()
        );

        return item;
    }

    public Optional<OrderItem> findById(UUID id) {
        String sql = "SELECT * FROM order_items WHERE id = ?";
        List<OrderItem> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<OrderItem> findAllByOrderId(UUID orderId, int offset, int limit) {
        String sql = "SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, orderId, limit, offset);
    }

    public List<OrderItem> findAllByProductId(UUID productId, int offset, int limit) {
        String sql = "SELECT * FROM order_items WHERE product_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, productId, limit, offset);
    }

    public List<OrderItem> findAll(int offset, int limit) {
        String sql = "SELECT * FROM order_items ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, limit, offset);
    }

    public void update(OrderItem item) {
        item.getAudit().setUpdatedAt(LocalDateTime.now());
        String sql = "UPDATE order_items SET quantity = ?, price = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                item.getQuantity(),
                item.getPrice(),
                item.getAudit().getUpdatedAt(),
                item.getId()
        );
    }

    public void deleteById(UUID id) {
        String sql = "DELETE FROM order_items WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
