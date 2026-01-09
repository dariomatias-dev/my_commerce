package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.enums.FreightType;
import com.dariomatias.my_commerce.enums.PaymentMethod;
import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.*;
import com.dariomatias.my_commerce.repository.contract.OrderContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.*;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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
        order.setStatus(Status.valueOf(rs.getString("status")));
        order.setPaymentMethod(PaymentMethod.valueOf(rs.getString("payment_method")));
        order.setFreightType(FreightType.valueOf(rs.getString("freight_type")));

        order.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        order.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        Store store = new Store();
        store.setId(UUID.fromString(rs.getString("store_id")));
        order.setStore(store);

        User user = new User();
        user.setId(UUID.fromString(rs.getString("user_id")));
        order.setUser(user);

        OrderAddress address = new OrderAddress();
        address.setId(UUID.fromString(rs.getString("address_id")));
        order.setAddress(address);

        return order;
    };

    private final RowMapper<Store> storeMapper = (rs, rowNum) -> {
        Store store = new Store();
        store.setId(UUID.fromString(rs.getString("id")));
        store.setName(rs.getString("name"));
        store.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        store.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return store;
    };

    @Override
    public Order save(Order order) {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        order.setId(id);
        order.getAudit().setCreatedAt(now);
        order.getAudit().setUpdatedAt(now);

        String sql = """
            INSERT INTO orders (
                id,
                store_id,
                user_id,
                address_id,
                payment_method,
                freight_type,
                total_amount,
                status,
                created_at,
                updated_at
            )
            VALUES (
                :id,
                :store_id,
                :user_id,
                :address_id,
                :payment_method,
                :freight_type,
                :total_amount,
                :status,
                :created_at,
                :updated_at
            )
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("store_id", order.getStore().getId())
                .addValue("user_id", order.getUser().getId())
                .addValue("address_id", order.getAddress().getId())
                .addValue("payment_method", order.getPaymentMethod().name())
                .addValue("freight_type", order.getFreightType().name())
                .addValue("total_amount", order.getTotalAmount())
                .addValue("status", order.getStatus().name())
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

        String orderSql = """
            SELECT
                id,
                store_id,
                user_id,
                address_id,
                payment_method,
                freight_type,
                freight_amount,
                total_amount,
                status,
                created_at,
                updated_at
            FROM orders
            WHERE id = :id
        """;

        List<Order> orders = jdbc.query(
                orderSql,
                new MapSqlParameterSource("id", id),
                (rs, rowNum) -> {
                    Order o = new Order();
                    o.setId(UUID.fromString(rs.getString("id")));
                    o.setTotalAmount(rs.getBigDecimal("total_amount"));
                    o.setFreightAmount(rs.getBigDecimal("freight_amount"));
                    o.setStatus(Status.valueOf(rs.getString("status")));
                    o.setPaymentMethod(PaymentMethod.valueOf(rs.getString("payment_method")));
                    o.setFreightType(FreightType.valueOf(rs.getString("freight_type")));

                    o.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                    o.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

                    Store store = new Store();
                    store.setId(UUID.fromString(rs.getString("store_id")));
                    o.setStore(store);

                    User user = new User();
                    user.setId(UUID.fromString(rs.getString("user_id")));
                    o.setUser(user);

                    OrderAddress address = new OrderAddress();
                    address.setId(UUID.fromString(rs.getString("address_id")));
                    o.setAddress(address);

                    o.setItems(new ArrayList<>());
                    return o;
                }
        );

        if (orders.isEmpty()) {
            return Optional.empty();
        }

        Order order = orders.get(0);

        String itemsSql = """
            SELECT
                id,
                product_id,
                quantity,
                price
            FROM order_items
            WHERE order_id = :order_id
        """;

        List<OrderItem> items = jdbc.query(
                itemsSql,
                new MapSqlParameterSource("order_id", id),
                (rs, rowNum) -> {
                    OrderItem item = new OrderItem();
                    item.setId(UUID.fromString(rs.getString("id")));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setPrice(rs.getBigDecimal("price"));
                    item.setProductId(UUID.fromString(rs.getString("product_id")));
                    item.setOrderId(id);
                    return item;
                }
        );

        order.setItems(items);

        return Optional.of(order);
    }

    @Override
    public Page<Store> findStoresWithOrdersByUserId(UUID userId, Pageable pageable) {

        String sql = """
            SELECT s.*
            FROM stores s
            JOIN orders o ON o.store_id = s.id
            WHERE o.user_id = :user_id
            GROUP BY s.id, s.name, s.created_at, s.updated_at
            ORDER BY MAX(o.created_at) DESC
            OFFSET :offset LIMIT :limit
        """;

        String countSql = """
            SELECT COUNT(DISTINCT s.id)
            FROM stores s
            JOIN orders o ON o.store_id = s.id
            WHERE o.user_id = :user_id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", userId)
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        List<Store> content = jdbc.query(sql, params, storeMapper);

        Long total = jdbc.queryForObject(
                countSql,
                new MapSqlParameterSource("user_id", userId),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Order> findAllByUserIdAndStoreId(
            UUID userId,
            UUID storeId,
            Pageable pageable
    ) {

        String sql = """
            SELECT *
            FROM orders
            WHERE user_id = :user_id
              AND store_id = :store_id
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", userId)
                .addValue("store_id", storeId)
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        List<Order> content = jdbc.query(sql, params, mapper);

        Long total = jdbc.queryForObject(
                """
                    SELECT COUNT(*)
                    FROM orders
                    WHERE user_id = :user_id
                      AND store_id = :store_id
                """,
                new MapSqlParameterSource()
                        .addValue("user_id", userId)
                        .addValue("store_id", storeId),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public long countByStoreIdAndStatus(UUID storeId, Status status) {
        String sql = """
            SELECT COUNT(*)
            FROM orders
            WHERE store_id = :storeId
              AND status = :status
        """;

        return jdbc.queryForObject(
                sql,
                new MapSqlParameterSource()
                        .addValue("storeId", storeId)
                        .addValue("status", status),
                Long.class
        );
    }

    @Override
    public long countDistinctCustomersByUserIdAndStatus(UUID userId, Status status) {
        String sql = """
            SELECT COUNT(DISTINCT o.user_id)
            FROM orders o
            INNER JOIN stores s ON o.store_id = s.id
            WHERE s.user_id = :user_id
              AND o.status = :status
        """;

        return jdbc.queryForObject(
                sql,
                new MapSqlParameterSource()
                        .addValue("user_id", userId)
                        .addValue("status", status.name()),
                Long.class
        );
    }

    @Override
    public BigDecimal sumTotalRevenueByUserIdAndStatus(UUID userId, Status status) {
        String sql = """
            SELECT COALESCE(SUM(o.total_amount), 0)
            FROM orders o
            INNER JOIN stores s ON o.store_id = s.id
            WHERE s.user_id = :user_id
              AND o.status = :status
        """;

        return jdbc.queryForObject(
                sql,
                new MapSqlParameterSource()
                        .addValue("user_id", userId)
                        .addValue("status", status.name()),
                BigDecimal.class
        );
    }

    @Override
    public long countDistinctCustomersByStoreIdAndStatus(UUID storeId, Status status) {
        String sql = """
            SELECT COUNT(DISTINCT o.user_id)
            FROM orders o
            WHERE o.store_id = :store_id
              AND o.status = :status
        """;

        return jdbc.queryForObject(
                sql,
                new MapSqlParameterSource()
                        .addValue("store_id", storeId)
                        .addValue("status", status.name()),
                Long.class
        );
    }

    @Override
    public BigDecimal sumTotalRevenueByStoreIdAndStatus(UUID storeId, Status status) {
        String sql = """
            SELECT COALESCE(SUM(o.total_amount), 0)
            FROM orders o
            WHERE o.store_id = :store_id
              AND o.status = :status
        """;

        return jdbc.queryForObject(
                sql,
                new MapSqlParameterSource()
                        .addValue("store_id", storeId)
                        .addValue("status", status.name()),
                BigDecimal.class
        );
    }

    @Override
    public Order update(Order order) {
        LocalDateTime now = LocalDateTime.now();
        order.getAudit().setUpdatedAt(now);

        String sql = """
            UPDATE orders
               SET total_amount   = :total_amount,
                   status         = :status,
                   payment_method = :payment_method,
                   freight_type   = :freight_type,
                   updated_at     = :updated_at
             WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", order.getId())
                .addValue("total_amount", order.getTotalAmount())
                .addValue("status", order.getStatus().name())
                .addValue("payment_method", order.getPaymentMethod().name())
                .addValue("freight_type", order.getFreightType().name())
                .addValue("updated_at", now));

        return order;
    }

    @Override
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM orders WHERE id = :id",
                new MapSqlParameterSource("id", id));
    }
}
