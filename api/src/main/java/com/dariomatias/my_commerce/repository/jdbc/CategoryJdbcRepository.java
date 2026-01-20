package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.repository.contract.CategoryContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class CategoryJdbcRepository implements CategoryContract {

    private final NamedParameterJdbcTemplate jdbc;

    public CategoryJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Category> mapper = (rs, rowNum) -> mapCategory(rs);

    private Category mapCategory(ResultSet rs) throws SQLException {
        Category category = new Category();
        category.setId(UUID.fromString(rs.getString("id")));
        category.setName(rs.getString("name"));
        category.setStoreId(UUID.fromString(rs.getString("store_id")));
        category.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        category.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        return category;
    }

    @Override
    public Category save(Category category) {
        LocalDateTime now = LocalDateTime.now();
        UUID id = UUID.randomUUID();

        category.setId(id);
        category.getAudit().setCreatedAt(now);
        category.getAudit().setUpdatedAt(now);

        String sql = """
            INSERT INTO categories (id, name, store_id, created_at, updated_at)
            VALUES (:id, :name, :store_id, :created_at, :updated_at)
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", category.getName())
                .addValue("store_id", category.getStoreId())
                .addValue("created_at", now)
                .addValue("updated_at", now));

        return category;
    }

    @Override
    public Page<Category> findAll(CategoryFilterDTO filter, Pageable pageable) {
        List<String> conditions = new ArrayList<>();
        MapSqlParameterSource params = new MapSqlParameterSource();

        if (filter.getStoreId() != null) {
            conditions.add("store_id = :storeId");
            params.addValue("storeId", filter.getStoreId());
        }

        if (filter.getName() != null && !filter.getName().isBlank()) {
            conditions.add("LOWER(name) LIKE :name");
            params.addValue("name", "%" + filter.getName().toLowerCase() + "%");
        }

        String where = conditions.isEmpty() ? "1=1" : String.join(" AND ", conditions);

        String sql = """
            SELECT *
            FROM categories
            WHERE %s
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """.formatted(where);

        params.addValue("offset", pageable.getOffset());
        params.addValue("limit", pageable.getPageSize());

        List<Category> content = jdbc.query(sql, params, mapper);

        String countSql = """
            SELECT COUNT(*)
            FROM categories
            WHERE %s
        """.formatted(where);

        long total = jdbc.queryForObject(countSql, params, Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<Category> findById(UUID id) {
        String sql = "SELECT * FROM categories WHERE id = :id";

        List<Category> list = jdbc.query(sql,
                new MapSqlParameterSource("id", id),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Category update(Category category) {
        LocalDateTime now = LocalDateTime.now();
        category.getAudit().setUpdatedAt(now);

        String sql = """
            UPDATE categories
            SET name = :name,
                store_id = :store_id,
                updated_at = :updated_at
            WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", category.getId())
                .addValue("name", category.getName())
                .addValue("store_id", category.getStoreId())
                .addValue("updated_at", now));

        return category;
    }

    @Override
    public void deleteById(UUID id) {
        String sql = "DELETE FROM categories WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }
}
