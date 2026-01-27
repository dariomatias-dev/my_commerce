package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.contract.SubscriptionPlanContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class SubscriptionPlanJdbcRepository implements SubscriptionPlanContract {

    private final NamedParameterJdbcTemplate jdbc;

    public SubscriptionPlanJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<SubscriptionPlan> mapper = (rs, rowNum) -> {
        SubscriptionPlan plan = new SubscriptionPlan();

        plan.setId(UUID.fromString(rs.getString("id")));
        plan.setName(rs.getString("name"));
        plan.setMaxStores(rs.getInt("max_stores"));
        plan.setMaxProducts(rs.getInt("max_products"));
        plan.setFeatures(rs.getString("features"));
        plan.setPrice(rs.getBigDecimal("price"));
        plan.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        plan.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        return plan;
    };

    @Override
    public SubscriptionPlan save(SubscriptionPlan plan) {
        LocalDateTime now = LocalDateTime.now();
        UUID id = UUID.randomUUID();

        String sql = """
            INSERT INTO subscription_plans 
            (id, name, max_stores, max_products, features, price, created_at, updated_at)
            VALUES (:id, :name, :max_stores, :max_products, :features, :price, :created_at, :updated_at)
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", plan.getName())
                .addValue("max_stores", plan.getMaxStores())
                .addValue("max_products", plan.getMaxProducts())
                .addValue("features", plan.getFeatures())
                .addValue("price", plan.getPrice())
                .addValue("created_at", now)
                .addValue("updated_at", now);

        jdbc.update(sql, params);

        plan.setId(id);
        plan.getAudit().setCreatedAt(now);
        plan.getAudit().setUpdatedAt(now);

        return plan;
    }

    @Override
    public Page<SubscriptionPlan> findAll(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        String sql = """
            SELECT * FROM subscription_plans
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<SubscriptionPlan> list = jdbc.query(
                sql,
                new MapSqlParameterSource()
                        .addValue("offset", offset)
                        .addValue("limit", pageable.getPageSize()),
                mapper
        );

        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Optional<SubscriptionPlan> findById(UUID id) {
        String sql = "SELECT * FROM subscription_plans WHERE id = :id";
        List<SubscriptionPlan> list = jdbc.query(sql, new MapSqlParameterSource("id", id), mapper);

        return list.stream().findFirst();
    }

    @Override
    public boolean existsByName(String name) {
        String sql = "SELECT COUNT(*) FROM subscription_plans WHERE name = :name";

        Long count = jdbc.queryForObject(
                sql,
                new MapSqlParameterSource("name", name),
                Long.class
        );

        return count != null && count > 0;
    }

    @Override
    public SubscriptionPlan update(SubscriptionPlan plan) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE subscription_plans SET
                name = :name,
                max_stores = :max_stores,
                max_products = :max_products,
                features = :features,
                price = :price,
                updated_at = :updated_at
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", plan.getId())
                .addValue("name", plan.getName())
                .addValue("max_stores", plan.getMaxStores())
                .addValue("max_products", plan.getMaxProducts())
                .addValue("features", plan.getFeatures())
                .addValue("price", plan.getPrice())
                .addValue("updated_at", now);

        jdbc.update(sql, params);
        plan.getAudit().setUpdatedAt(now);

        return plan;
    }

    @Override
    public void deleteById(UUID id) {
        String sql = "DELETE FROM subscription_plans WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }
}
