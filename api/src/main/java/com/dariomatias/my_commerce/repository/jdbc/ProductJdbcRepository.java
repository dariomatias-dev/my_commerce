package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
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
public class ProductJdbcRepository implements ProductContract {

    private final NamedParameterJdbcTemplate jdbc;

    public ProductJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Product> mapper = (rs, rowNum) -> {
        Product p = new Product();
        p.setId(UUID.fromString(rs.getString("id")));
        p.setStoreId(UUID.fromString(rs.getString("store_id")));
        p.setCategoryId(UUID.fromString(rs.getString("category_id")));
        p.setName(rs.getString("name"));
        p.setSlug(rs.getString("slug"));
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getBigDecimal("price"));
        p.setStock(rs.getInt("stock"));
        p.setActive(rs.getBoolean("active"));
        p.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        p.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return p;
    };

    @Override
    public Product save(Product product) {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            INSERT INTO products (id, store_id, category_id, name, slug, description, price, stock, active, created_at, updated_at)
            VALUES (:id, :store_id, :category_id, :name, :slug, :description, :price, :stock, :active, :created_at, :updated_at)
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("store_id", product.getStoreId())
                .addValue("category_id", product.getCategoryId())
                .addValue("name", product.getName())
                .addValue("slug", product.getSlug())
                .addValue("description", product.getDescription())
                .addValue("price", product.getPrice())
                .addValue("stock", product.getStock())
                .addValue("active", product.getActive())
                .addValue("created_at", now)
                .addValue("updated_at", now));

        product.setId(id);
        product.getAudit().setCreatedAt(now);
        product.getAudit().setUpdatedAt(now);

        return product;
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        String sql = """
            SELECT * FROM products
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Product> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM products",
                new MapSqlParameterSource(),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Product> findAllByStore(UUID storeId, Pageable pageable) {
        String sql = """
            SELECT * FROM products
            WHERE store_id = :store_id
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Product> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("store_id", storeId)
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM products WHERE store_id = :store_id",
                new MapSqlParameterSource("store_id", storeId),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Product> findAllByCategory(UUID categoryId, Pageable pageable) {
        String sql = """
            SELECT * FROM products
            WHERE category_id = :category_id
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """;

        List<Product> content = jdbc.query(sql,
                new MapSqlParameterSource()
                        .addValue("category_id", categoryId)
                        .addValue("offset", pageable.getOffset())
                        .addValue("limit", pageable.getPageSize()),
                mapper);

        long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM products WHERE category_id = :category_id",
                new MapSqlParameterSource("category_id", categoryId),
                Long.class
        );

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<Product> findById(UUID id) {
        String sql = "SELECT * FROM products WHERE id = :id";

        List<Product> list = jdbc.query(sql,
                new MapSqlParameterSource("id", id),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Optional<Product> findBySlug(String slug) {
        String sql = "SELECT * FROM products WHERE slug = :slug";

        List<Product> list = jdbc.query(sql,
                new MapSqlParameterSource("slug", slug),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Product update(Product product) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE products
            SET store_id = :store_id,
                category_id = :category_id,
                name = :name,
                slug = :slug,
                description = :description,
                price = :price,
                stock = :stock,
                active = :active,
                updated_at = :updated_at
            WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", product.getId())
                .addValue("store_id", product.getStoreId())
                .addValue("category_id", product.getCategoryId())
                .addValue("name", product.getName())
                .addValue("slug", product.getSlug())
                .addValue("description", product.getDescription())
                .addValue("price", product.getPrice())
                .addValue("stock", product.getStock())
                .addValue("active", product.getActive())
                .addValue("updated_at", now));

        product.getAudit().setUpdatedAt(now);
        return product;
    }

    @Override
    public void deleteById(UUID id) {
        jdbc.update("DELETE FROM products WHERE id = :id",
                new MapSqlParameterSource("id", id));
    }
}
