package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class SubscriptionPlanJdbcRepository {

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
        plan.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        plan.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return plan;
    };

    public SubscriptionPlan save(SubscriptionPlan plan) {
        LocalDateTime now = LocalDateTime.now();
        UUID id = UUID.randomUUID();

        String sql = """
            INSERT INTO subscription_plans (id, name, max_stores, max_products, features, price, created_at, updated_at)
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
        plan.setCreatedAt(now);
        plan.setUpdatedAt(now);
        return plan;
    }

    public List<SubscriptionPlan> findAll(int offset, int limit) {
        String sql = "SELECT * FROM subscription_plans ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("offset", offset)
                .addValue("limit", limit), mapper);
    }

    public Optional<SubscriptionPlan> findById(UUID id) {
        String sql = "SELECT * FROM subscription_plans WHERE id = :id";
        List<SubscriptionPlan> list = jdbc.query(sql, new MapSqlParameterSource("id", id), mapper);
        return list.stream().findFirst();
    }

    public void update(SubscriptionPlan plan) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE subscription_plans
            SET name = :name,
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
        plan.setUpdatedAt(now);
    }

    public void delete(UUID id) {
        String sql = "DELETE FROM subscription_plans WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }
}
