package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.ProductImage;
import com.dariomatias.my_commerce.repository.contract.ProductImageContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class ProductImageJdbcRepository implements ProductImageContract {

    private final NamedParameterJdbcTemplate jdbc;

    public ProductImageJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<ProductImage> mapper = (rs, rowNum) -> {
        ProductImage image = new ProductImage();
        image.setId(UUID.fromString(rs.getString("id")));
        image.setProductId(UUID.fromString(rs.getString("product_id")));
        image.setUrl(rs.getString("url"));
        image.setPosition(rs.getInt("position"));
        image.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        image.getAudit().setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

        return image;
    };

    @Override
    public ProductImage save(ProductImage image) {
        if (image.getId() == null) {
            return insert(image);
        }

        return update(image);
    }

    @Override
    public List<ProductImage> findAllByProduct(UUID productId) {
        String sql = """
            SELECT *
            FROM product_images
            WHERE product_id = :product_id
            ORDER BY position ASC
        """;

        return jdbc.query(
                sql,
                new MapSqlParameterSource("product_id", productId),
                mapper
        );
    }

    private ProductImage insert(ProductImage image) {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            INSERT INTO product_images
                (id, product_id, url, position, created_at, updated_at)
            VALUES
                (:id, :product_id, :url, :position, :created_at, :updated_at)
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("product_id", image.getProductId())
                .addValue("url", image.getUrl())
                .addValue("position", image.getPosition())
                .addValue("created_at", now)
                .addValue("updated_at", now)
        );

        image.setId(id);
        image.getAudit().setCreatedAt(now);
        image.getAudit().setUpdatedAt(now);

        return image;
    }

    private ProductImage update(ProductImage image) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE product_images
            SET
                url = :url,
                position = :position,
                updated_at = :updated_at
            WHERE id = :id
        """;

        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("id", image.getId())
                .addValue("url", image.getUrl())
                .addValue("position", image.getPosition())
                .addValue("updated_at", now)
        );

        image.getAudit().setUpdatedAt(now);

        return image;
    }

    @Override
    public void delete(ProductImage image) {
        String sql = "DELETE FROM product_images WHERE id = :id";

        jdbc.update(sql,
                new MapSqlParameterSource("id", image.getId())
        );
    }
}
