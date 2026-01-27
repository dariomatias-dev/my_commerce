package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.dto.stores.StoreFilterDTO;
import com.dariomatias.my_commerce.enums.StatusFilter;
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
        store.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        store.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        if (rs.getTimestamp("deleted_at") != null) {
            store.setDeletedAt(rs.getTimestamp("deleted_at").toLocalDateTime());
        }

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
    public Page<Store> findAll(StoreFilterDTO filter, Pageable pageable) {
        StringBuilder sql = new StringBuilder("SELECT * FROM stores WHERE 1=1");
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM stores WHERE 1=1");
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (filter.getUserId() != null) {
            sql.append(" AND user_id = :userId");
            countSql.append(" AND user_id = :userId");
            params.addValue("userId", filter.getUserId());
        }

        if (filter.getStatus() != null) {
            switch (filter.getStatus()) {
                case ACTIVE -> {
                    sql.append(" AND deleted_at IS NULL");
                    countSql.append(" AND deleted_at IS NULL");
                }
                case DELETED -> {
                    sql.append(" AND deleted_at IS NOT NULL");
                    countSql.append(" AND deleted_at IS NOT NULL");
                }
                case ALL -> {}
            }
        }

        sql.append(" ORDER BY created_at DESC OFFSET :offset LIMIT :limit");
        params.addValue("offset", pageable.getOffset());
        params.addValue("limit", pageable.getPageSize());

        List<Store> content = jdbc.query(sql.toString(), params, mapper);
        long total = jdbc.queryForObject(countSql.toString(), params, Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public List<Store> findAllByUserId(UUID userId) {
        String sql = "SELECT * FROM stores WHERE user_id = :userId AND deleted_at IS NULL";

        return jdbc.query(sql, new MapSqlParameterSource("userId", userId), mapper);
    }

    @Override
    public Optional<Store> findById(UUID id) {
        String sql = """
            SELECT * FROM stores
            WHERE id = :id
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
            WHERE slug = :slug
        """;

        List<Store> list = jdbc.query(sql,
                new MapSqlParameterSource("slug", slug),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public boolean existsBySlugAndDeletedAtIsNull(String slug) {
        String sql = """
            SELECT 1
            FROM stores
            WHERE slug = :slug
              AND deleted_at IS NULL
            LIMIT 1
        """;

        List<Integer> result = jdbc.query(
                sql,
                new MapSqlParameterSource("slug", slug),
                (rs, rowNum) -> rs.getInt(1)
        );

        return !result.isEmpty();
    }

    @Override
    public long countByIsActiveTrueAndDeletedAtIsNull() {
        String sql = "SELECT COUNT(*) FROM stores WHERE is_active = true AND deleted_at IS NULL";

        return jdbc.queryForObject(sql, new MapSqlParameterSource(), Long.class);
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
    public void delete(Store store) {
        String sql = """
            UPDATE stores
            SET is_active = false,
                deleted_at = :deleted_at
            WHERE id = :id
        """;

        LocalDateTime now = LocalDateTime.now();

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", store.getId())
                .addValue("deleted_at", now));
    }

    @Override
    public void deleteByUserId(UUID userId) {
            jdbc.update("""
            UPDATE stores
            SET is_active = false,
                deleted_at = :deletedAt
            WHERE user_id = :userId
              AND deleted_at IS NULL
        """, new MapSqlParameterSource()
                    .addValue("userId", userId)
                    .addValue("deletedAt", LocalDateTime.now()));
    }
}
