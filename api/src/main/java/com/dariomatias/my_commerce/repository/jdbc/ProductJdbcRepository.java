package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Product;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class ProductJdbcRepository {

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
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getDouble("price"));
        p.setStock(rs.getInt("stock"));
        p.setActive(rs.getBoolean("active"));
        p.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        p.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        p.setImages(findImagesByProductId(p.getId()));
        return p;
    };

    private List<String> findImagesByProductId(UUID productId) {
        String sql = "SELECT image_url FROM product_images WHERE product_id = :product_id";
        return jdbc.query(sql, new MapSqlParameterSource("product_id", productId),
                (rs, rowNum) -> rs.getString("image_url"));
    }

    public Product save(Product product) {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            INSERT INTO products (id, store_id, category_id, name, description, price, stock, active, created_at, updated_at)
            VALUES (:id, :store_id, :category_id, :name, :description, :price, :stock, :active, :created_at, :updated_at)
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("store_id", product.getStoreId())
                .addValue("category_id", product.getCategoryId())
                .addValue("name", product.getName())
                .addValue("description", product.getDescription())
                .addValue("price", product.getPrice())
                .addValue("stock", product.getStock())
                .addValue("active", product.getActive())
                .addValue("created_at", now)
                .addValue("updated_at", now);

        jdbc.update(sql, params);

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            saveImages(id, product.getImages());
        }

        product.setId(id);
        product.getAudit().setCreatedAt(now);
        product.getAudit().setUpdatedAt(now);

        return product;
    }

    private void saveImages(UUID productId, List<String> images) {
        String sql = "INSERT INTO product_images (product_id, image_url) VALUES (:product_id, :image_url)";
        for (String image : images) {
            jdbc.update(sql, new MapSqlParameterSource()
                    .addValue("product_id", productId)
                    .addValue("image_url", image));
        }
    }

    public List<Product> findAll(int offset, int limit) {
        String sql = "SELECT * FROM products ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("offset", offset)
                .addValue("limit", limit), mapper);
    }

    public List<Product> findAllByStore(UUID storeId, int offset, int limit) {
        String sql = "SELECT * FROM products WHERE store_id = :store_id ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("store_id", storeId)
                .addValue("offset", offset)
                .addValue("limit", limit), mapper);
    }

    public List<Product> findAllByCategory(UUID categoryId, int offset, int limit) {
        String sql = "SELECT * FROM products WHERE category_id = :category_id ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("category_id", categoryId)
                .addValue("offset", offset)
                .addValue("limit", limit), mapper);
    }

    public Optional<Product> findById(UUID id) {
        String sql = "SELECT * FROM products WHERE id = :id";
        List<Product> list = jdbc.query(sql, new MapSqlParameterSource("id", id), mapper);
        return list.stream().findFirst();
    }

    public void update(Product product) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE products
            SET store_id = :store_id,
                category_id = :category_id,
                name = :name,
                description = :description,
                price = :price,
                stock = :stock,
                active = :active,
                updated_at = :updated_at
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", product.getId())
                .addValue("store_id", product.getStoreId())
                .addValue("category_id", product.getCategoryId())
                .addValue("name", product.getName())
                .addValue("description", product.getDescription())
                .addValue("price", product.getPrice())
                .addValue("stock", product.getStock())
                .addValue("active", product.getActive())
                .addValue("updated_at", now);

        jdbc.update(sql, params);

        String deleteImages = "DELETE FROM product_images WHERE product_id = :product_id";
        jdbc.update(deleteImages, new MapSqlParameterSource("product_id", product.getId()));

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            saveImages(product.getId(), product.getImages());
        }

        product.getAudit().setUpdatedAt(now);
    }

    public void delete(UUID id) {
        String deleteImages = "DELETE FROM product_images WHERE product_id = :product_id";
        jdbc.update(deleteImages, new MapSqlParameterSource("product_id", id));

        String sql = "DELETE FROM products WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }
}
