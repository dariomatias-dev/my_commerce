package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
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
public class StoreJdbcRepository implements StoreContract {

    private final NamedParameterJdbcTemplate jdbc;

    public StoreJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Store> mapper = (rs, rowNum) -> {
        Store store = new Store();
        store.setId(UUID.fromString(rs.getString("id")));
        store.setName(rs.getString("name"));
        store.setSlug(rs.getString("slug"));
        store.setDescription(rs.getString("description"));
        store.setThemeColor(rs.getString("theme_color"));
        store.setIsActive(rs.getBoolean("is_active"));
        store.setDeletedAt(rs.getTimestamp("deleted_at") != null
                ? rs.getTimestamp("deleted_at").toLocalDateTime()
                : null);

        store.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        store.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        return store;
    };

    @Override
    public Store save(Store store) {
        LocalDateTime now = LocalDateTime.now();
        UUID id = UUID.randomUUID();

        String sql = """
            INSERT INTO stores (id, name, slug, description, theme_color, is_active, deleted_at, user_id, created_at, updated_at)
            VALUES (:id, :name, :slug, :description, :theme_color, :is_active, :deleted_at, :user_id, :created_at, :updated_at)
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", store.getName())
                .addValue("slug", store.getSlug())
                .addValue("description", store.getDescription())
                .addValue("theme_color", store.getThemeColor())
                .addValue("is_active", store.getIsActive())
                .addValue("deleted_at", store.getDeletedAt())
                .addValue("user_id", store.getUser().getId())
                .addValue("created_at", now)
                .addValue("updated_at", now));

        store.setId(id);
        store.getAudit().setCreatedAt(now);
        store.getAudit().setUpdatedAt(now);

        return store;
    }

    @Override
    public Store update(Store store) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE stores
            SET name = :name,
                slug = :slug,
                description = :description,
                theme_color = :theme_color,
                is_active = :is_active,
                deleted_at = :deleted_at,
                updated_at = :updated_at
            WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", store.getId())
                .addValue("name", store.getName())
                .addValue("slug", store.getSlug())
                .addValue("description", store.getDescription())
                .addValue("theme_color", store.getThemeColor())
                .addValue("is_active", store.getIsActive())
                .addValue("deleted_at", store.getDeletedAt())
                .addValue("updated_at", now));

        store.getAudit().setUpdatedAt(now);
        return store;
    }

    @Override
    public void delete(UUID id) {
        String sql = "DELETE FROM stores WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }

    @Override
    public Optional<Store> findById(UUID id) {
        String sql = """
            SELECT * FROM stores
            WHERE id = :id AND deleted_at IS NULL
        """;

        List<Store> list = jdbc.query(sql,
                new MapSqlParameterSource("id", id),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Optional<Store> findBySlug(String slug) {
        String sql = """
            SELECT * FROM stores
            WHERE slug = :slug AND deleted_at IS NULL
        """;

        List<Store> list = jdbc.query(sql,
                new MapSqlParameterSource("slug", slug),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public boolean existsBySlug(String slug) {
        String sql = "SELECT COUNT(*) FROM stores WHERE slug = :slug";
        Integer count = jdbc.queryForObject(sql,
                new MapSqlParameterSource("slug", slug),
                Integer.class);
        return count != null && count > 0;
    }

    @Override
    public Page<Store> findAll(Pageable pageable) {
        String sql = """
            SELECT * FROM stores
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Store> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        String countSql = "SELECT COUNT(*) FROM stores WHERE deleted_at IS NULL";
        long total = jdbc.queryForObject(countSql, new MapSqlParameterSource(), Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Store> findAllByUser(UUID userId, Pageable pageable) {
        String sql = """
            SELECT * FROM stores
            WHERE user_id = :user_id AND deleted_at IS NULL
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Store> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("user_id", userId)
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        String countSql = """
            SELECT COUNT(*) FROM stores
            WHERE user_id = :user_id AND deleted_at IS NULL
        """;

        long total = jdbc.queryForObject(countSql,
                new MapSqlParameterSource("user_id", userId),
                Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public void deactivateByUserId(UUID userId) {
        String sql = """
            UPDATE stores
            SET deleted_at = :deleted_at,
                is_active = false,
                updated_at = :updated_at
            WHERE user_id = :user_id
        """;

        LocalDateTime now = LocalDateTime.now();

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("user_id", userId)
                .addValue("deleted_at", now)
                .addValue("updated_at", now));
    }
}
