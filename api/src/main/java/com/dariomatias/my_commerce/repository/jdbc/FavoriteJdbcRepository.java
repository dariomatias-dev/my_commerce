package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
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
public class FavoriteJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public FavoriteJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Favorite> rowMapper = this::mapFavorite;

    private Favorite mapFavorite(ResultSet rs, int rowNum) throws SQLException {
        Favorite favorite = new Favorite();
        favorite.setId(UUID.fromString(rs.getString("id")));

        User user = new User();
        user.setId(UUID.fromString(rs.getString("user_id")));
        favorite.setUser(user);

        Product product = new Product();
        product.setId(UUID.fromString(rs.getString("product_id")));
        favorite.setProduct(product);

        favorite.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return favorite;
    }

    public Favorite save(Favorite favorite) {
        if (favorite.getId() == null) favorite.setId(UUID.randomUUID());
        LocalDateTime now = LocalDateTime.now();
        favorite.setCreatedAt(now);

        String sql = "INSERT INTO favorites (id, user_id, product_id, created_at) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                favorite.getId(),
                favorite.getUser().getId(),
                favorite.getProduct().getId(),
                favorite.getCreatedAt()
        );
        return favorite;
    }

    public Optional<Favorite> findById(UUID id) {
        String sql = "SELECT * FROM favorites WHERE id = ?";
        List<Favorite> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public void deleteById(UUID id) {
        String sql = "DELETE FROM favorites WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<Favorite> findAllByUserId(UUID userId, int offset, int limit) {
        String sql = "SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, userId, limit, offset);
    }

    public List<Favorite> findAllByProductId(UUID productId, int offset, int limit) {
        String sql = "SELECT * FROM favorites WHERE product_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, productId, limit, offset);
    }

    public List<Favorite> findAll(int offset, int limit) {
        String sql = "SELECT * FROM favorites ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, limit, offset);
    }
}
