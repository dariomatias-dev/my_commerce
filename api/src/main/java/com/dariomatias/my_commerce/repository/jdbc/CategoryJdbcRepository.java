package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Category;
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
public class CategoryJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public CategoryJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Category> rowMapper = this::mapCategory;

    private Category mapCategory(ResultSet rs, int rowNum) throws SQLException {
        Category category = new Category();
        category.setId(UUID.fromString(rs.getString("id")));
        category.setName(rs.getString("name"));
        category.setStoreId(UUID.fromString(rs.getString("store_id")));
        category.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        category.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return category;
    }

    public Category save(Category category) {
        if (category.getId() == null) {
            category.setId(UUID.randomUUID());
        }
        LocalDateTime now = LocalDateTime.now();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);

        String sql = "INSERT INTO categories (id, name, store_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                category.getId(),
                category.getName(),
                category.getStoreId(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );

        return category;
    }

    public void update(Category category) {
        category.setUpdatedAt(LocalDateTime.now());

        String sql = "UPDATE categories SET name = ?, store_id = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                category.getName(),
                category.getStoreId(),
                category.getUpdatedAt(),
                category.getId()
        );
    }

    public void delete(UUID id) {
        String sql = "DELETE FROM categories WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public Optional<Category> findById(UUID id) {
        String sql = "SELECT * FROM categories WHERE id = ?";
        List<Category> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<Category> findAll(int offset, int limit) {
        String sql = "SELECT * FROM categories ORDER BY name LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, limit, offset);
    }

    public List<Category> findAllByStoreId(UUID storeId, int offset, int limit) {
        String sql = "SELECT * FROM categories WHERE store_id = ? ORDER BY name LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, storeId, limit, offset);
    }
}
