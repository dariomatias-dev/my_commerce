package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.dto.product.ProductFilterDTO;
import com.dariomatias.my_commerce.enums.StatusFilter;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

        jdbc.update("""
            INSERT INTO products (id, store_id, category_id, name, slug, description, price, stock, active, created_at, updated_at)
            VALUES (:id, :store_id, :category_id, :name, :slug, :description, :price, :stock, :active, :created_at, :updated_at)
        """, new MapSqlParameterSource()
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
    public Page<Product> findAll(ProductFilterDTO filter, Pageable pageable) {
        List<String> conditions = new ArrayList<>();
        MapSqlParameterSource params = new MapSqlParameterSource();

        params.addValue("storeId", filter.getStoreId());
        conditions.add("store_id = :storeId");

        if (filter.getCategoryId() != null) {
            conditions.add("category_id = :categoryId");
            params.addValue("categoryId", filter.getCategoryId());
        }

        if (filter.getLowStockThreshold() != null) {
            conditions.add("stock <= :lowStock");
            params.addValue("lowStock", filter.getLowStockThreshold());
        }

        StatusFilter status = filter.getStatus();
        if (status == null) {
            status = StatusFilter.ACTIVE;
        }

        if (status == StatusFilter.ACTIVE) {
            conditions.add("deleted_at IS NULL");
        } else if (status == StatusFilter.DELETED) {
            conditions.add("deleted_at IS NOT NULL");
        }

        String where = String.join(" AND ", conditions);

        String sql = """
            SELECT *
            FROM products
            WHERE %s
            ORDER BY created_at DESC
            OFFSET :offset LIMIT :limit
        """.formatted(where);

        params.addValue("offset", pageable.getOffset());
        params.addValue("limit", pageable.getPageSize());

        List<Product> content = jdbc.query(sql, params, mapper);

        String countSql = """
            SELECT COUNT(*)
            FROM products
            WHERE %s
        """.formatted(where);

        long total = jdbc.queryForObject(countSql, params, Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Product> findAllByStoreIdAndIdInAndDeletedAtIsNull(UUID storeId, List<UUID> productIds, Pageable pageable) {
        if (productIds == null || productIds.isEmpty()) {
            return Page.empty(pageable);
        }

        String sql = """
        SELECT *
        FROM products
        WHERE store_id = :storeId
          AND id IN (:ids)
          AND deleted_at IS NULL
        ORDER BY created_at DESC
        OFFSET :offset LIMIT :limit
    """;

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("storeId", storeId);
        params.addValue("ids", productIds);
        params.addValue("offset", pageable.getOffset());
        params.addValue("limit", pageable.getPageSize());

        List<Product> content = jdbc.query(sql, params, mapper);

        String countSql = """
        SELECT COUNT(*)
        FROM products
        WHERE store_id = :storeId
          AND id IN (:ids)
          AND deleted_at IS NULL
    """;

        long total = jdbc.queryForObject(countSql, params, Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<Product> findByStoreSlugAndProductSlug(String storeSlug, String productSlug) {
        List<Product> list = jdbc.query("""
            SELECT p.*
            FROM products p
            INNER JOIN stores s ON p.store_id = s.id
            WHERE s.slug = :storeSlug
              AND p.slug = :productSlug
              AND p.deleted_at IS NULL
        """, new MapSqlParameterSource()
                        .addValue("storeSlug", storeSlug)
                        .addValue("productSlug", productSlug),
                mapper);

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Optional<Product> findByIdAndDeletedAtIsNull(UUID id) {
        String sql = "SELECT * FROM products WHERE id = :id AND deleted_at IS NULL";

        List<Product> list = jdbc.query(sql, new MapSqlParameterSource("id", id), mapper);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Optional<Product> findById(UUID id) {
        List<Product> list = jdbc.query(
                "SELECT * FROM products WHERE id = :id",
                new MapSqlParameterSource("id", id),
                mapper
        );

        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public long countByStoreIdAndActiveTrue(UUID storeId) {
        String sql = """
        SELECT COUNT(*)
        FROM products
        WHERE store_id = :store_id
          AND active = TRUE
          AND deleted_at IS NULL
    """;

        return jdbc.queryForObject(
                sql,
                new MapSqlParameterSource("store_id", storeId),
                Long.class
        );
    }

    @Override
    public Product update(Product product) {
        LocalDateTime now = LocalDateTime.now();

        jdbc.update("""
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
        """, new MapSqlParameterSource()
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
    public void delete(UUID id) {
        jdbc.update("""
            UPDATE products
            SET deleted_at = :deletedAt,
                active = false
            WHERE id = :id
        """, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("deletedAt", LocalDateTime.now()));
    }
}
