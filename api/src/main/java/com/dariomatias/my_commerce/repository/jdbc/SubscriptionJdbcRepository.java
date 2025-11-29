package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.repository.contract.SubscriptionContract;
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
public class SubscriptionJdbcRepository implements SubscriptionContract {

    private final NamedParameterJdbcTemplate jdbc;

    public SubscriptionJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Subscription> mapper = (rs, rowNum) -> {
        Subscription s = new Subscription();
        s.setId(UUID.fromString(rs.getString("id")));
        s.setUserId(UUID.fromString(rs.getString("user_id")));
        s.setPlanId(UUID.fromString(rs.getString("plan_id")));
        s.setStartDate(rs.getTimestamp("start_date").toLocalDateTime());
        s.setEndDate(rs.getTimestamp("end_date").toLocalDateTime());
        s.setIsActive(rs.getBoolean("is_active"));
        s.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        s.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return s;
    };

    @Override
    public Subscription save(Subscription s) {
        LocalDateTime now = LocalDateTime.now();
        UUID id = UUID.randomUUID();

        String sql = """
            INSERT INTO subscriptions
            (id, user_id, plan_id, start_date, end_date, is_active, created_at, updated_at)
            VALUES (:id, :user_id, :plan_id, :start_date, :end_date, :is_active, :created_at, :updated_at)
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("user_id", s.getUserId())
                .addValue("plan_id", s.getPlanId())
                .addValue("start_date", s.getStartDate())
                .addValue("end_date", s.getEndDate())
                .addValue("is_active", s.getIsActive())
                .addValue("created_at", now)
                .addValue("updated_at", now);

        jdbc.update(sql, params);

        s.setId(id);
        s.getAudit().setCreatedAt(now);
        s.getAudit().setUpdatedAt(now);
        return s;
    }

    @Override
    public Subscription update(Subscription s) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE subscriptions SET
                user_id = :user_id,
                plan_id = :plan_id,
                start_date = :start_date,
                end_date = :end_date,
                is_active = :is_active,
                updated_at = :updated_at
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", s.getId())
                .addValue("user_id", s.getUserId())
                .addValue("plan_id", s.getPlanId())
                .addValue("start_date", s.getStartDate())
                .addValue("end_date", s.getEndDate())
                .addValue("is_active", s.getIsActive())
                .addValue("updated_at", now);

        jdbc.update(sql, params);

        s.getAudit().setUpdatedAt(now);
        return s;
    }

    @Override
    public void delete(UUID id) {
        String sql = "DELETE FROM subscriptions WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }

    @Override
    public Optional<Subscription> findById(UUID id) {
        String sql = "SELECT * FROM subscriptions WHERE id = :id";

        List<Subscription> list = jdbc.query(
                sql,
                new MapSqlParameterSource("id", id),
                mapper
        );

        return list.stream().findFirst();
    }

    @Override
    public Page<Subscription> findAll(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        String sql = """
            SELECT * FROM subscriptions
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Subscription> list = jdbc.query(
                sql,
                new MapSqlParameterSource()
                        .addValue("offset", offset)
                        .addValue("limit", pageable.getPageSize()),
                mapper
        );

        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Page<Subscription> findAllByUser(UUID userId, Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        String sql = """
            SELECT * FROM subscriptions
            WHERE user_id = :user_id
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", userId)
                .addValue("offset", offset)
                .addValue("limit", pageable.getPageSize());

        List<Subscription> list = jdbc.query(sql, params, mapper);

        return new PageImpl<>(list, pageable, list.size());
    }
}
