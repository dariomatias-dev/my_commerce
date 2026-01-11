package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.OrderItem;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.contract.OrderItemContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.*;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class OrderItemJdbcRepository implements OrderItemContract {

    private final NamedParameterJdbcTemplate jdbc;

    public OrderItemJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<OrderItem> mapper = this::map;

    private OrderItem map(ResultSet rs, int row) throws SQLException {
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

    @Override
    public OrderItem save(OrderItem item) {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        item.setId(id);
        item.getAudit().setCreatedAt(now);
        item.getAudit().setUpdatedAt(now);

        String sql = """
            INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at, updated_at)
            VALUES (:id, :order_id, :product_id, :quantity, :price, :created_at, :updated_at)
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("order_id", item.getOrder().getId())
                .addValue("product_id", item.getProduct().getId())
                .addValue("quantity", item.getQuantity())
                .addValue("price", item.getPrice())
                .addValue("created_at", now)
                .addValue("updated_at", now));

        return item;
    }

    @Override
    public Page<OrderItem> findAll(Pageable pageable) {
        String sql = """
            SELECT * FROM order_items
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<OrderItem> content = jdbc.query(sql, new MapSqlParameterSource()
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize()), mapper);

        Long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM order_items",
                new MapSqlParameterSource(), Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<OrderItem> findById(UUID id) {
        List<OrderItem> list = jdbc.query(
                "SELECT * FROM order_items WHERE id = :id",
                new MapSqlParameterSource("id", id),
                mapper
        );

        return list.stream().findFirst();
    }

    @Override
    public OrderItem update(OrderItem item) {
        LocalDateTime now = LocalDateTime.now();
        item.getAudit().setUpdatedAt(now);

        String sql = """
            UPDATE order_items
               SET quantity = :quantity,
                   price = :price,
                   updated_at = :updated_at
             WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", item.getId())
                .addValue("quantity", item.getQuantity())
                .addValue("price", item.getPrice())
                .addValue("updated_at", now));

        return item;
    }

    @Override
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM order_items WHERE id = :id",
                new MapSqlParameterSource("id", id));
    }
}
