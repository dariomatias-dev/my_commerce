package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.repository.contract.FavoriteContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class FavoriteJdbcRepository implements FavoriteContract {

    private final JdbcTemplate jdbc;

    public FavoriteJdbcRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Favorite> mapper = this::mapRow;

    private Favorite mapRow(ResultSet rs, int rowNum) throws SQLException {
        Favorite f = new Favorite();
        f.setId(UUID.fromString(rs.getString("id")));
        f.setUserId(UUID.fromString(rs.getString("user_id")));
        f.setProductId(UUID.fromString(rs.getString("product_id")));
        f.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return f;
    }

    @Override
    public Favorite save(Favorite favorite) {
        if (favorite.getId() == null) favorite.setId(UUID.randomUUID());
        LocalDateTime now = LocalDateTime.now();
        favorite.setCreatedAt(now);

        String sql = "INSERT INTO favorites (id, user_id, product_id, created_at) VALUES (?, ?, ?, ?)";

        jdbc.update(sql,
                favorite.getId(),
                favorite.getUserId(),
                favorite.getProductId(),
                favorite.getCreatedAt()
        );

        return favorite;
    }

    @Override
    public Page<Favorite> findAll(Pageable pageable) {
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();

        String sql = "SELECT * FROM favorites ORDER BY created_at DESC LIMIT ? OFFSET ?";
        List<Favorite> content = jdbc.query(sql, mapper, limit, offset);

        String countSql = "SELECT COUNT(*) FROM favorites";
        long total = jdbc.queryForObject(countSql, Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Favorite> findAllByUserId(UUID userId, Pageable pageable) {
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();

        String sql = "SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        List<Favorite> content = jdbc.query(sql, mapper, userId, limit, offset);

        String countSql = "SELECT COUNT(*) FROM favorites WHERE user_id = ?";
        long total = jdbc.queryForObject(countSql, Long.class, userId);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Favorite> findAllByProductId(UUID productId, Pageable pageable) {
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();

        String sql = "SELECT * FROM favorites WHERE product_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        List<Favorite> content = jdbc.query(sql, mapper, productId, limit, offset);

        String countSql = "SELECT COUNT(*) FROM favorites WHERE product_id = ?";
        long total = jdbc.queryForObject(countSql, Long.class, productId);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<Favorite> findById(UUID id) {
        String sql = "SELECT * FROM favorites WHERE id = ?";
        List<Favorite> list = jdbc.query(sql, mapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public void deleteById(UUID id) {
        String sql = "DELETE FROM favorites WHERE id = ?";
        jdbc.update(sql, id);
    }
}
