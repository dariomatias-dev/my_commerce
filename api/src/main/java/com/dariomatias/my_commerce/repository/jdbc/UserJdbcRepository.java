package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.enums.UserRole;
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
public class UserJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> rowMapper = this::mapUser;

    private User mapUser(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(UUID.fromString(rs.getString("id")));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        String roleStr = rs.getString("role");
        user.setRole(UserRole.valueOf(roleStr));
        user.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        user.setEnabled(rs.getBoolean("enabled"));
        return user;
    }

    public User save(User user) {
        if (user.getId() == null) user.setId(UUID.randomUUID());
        if (user.getAudit().getCreatedAt() == null) user.getAudit().setCreatedAt(LocalDateTime.now());
        if (user.getRole() == null) user.setRole(UserRole.USER);
        String sql = "INSERT INTO users (id, name, email, password, role, created_at, enabled) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getAudit().getCreatedAt(),
                user.isEnabled()
        );
        return user;
    }

    public Optional<User> findById(UUID id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<User> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        List<User> list = jdbcTemplate.query(sql, rowMapper, email);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    public List<User> findAll(int offset, int limit) {
        String sql = "SELECT * FROM users ORDER BY name LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, rowMapper, limit, offset);
    }

    public boolean existsById(UUID id) {
        String sql = "SELECT COUNT(*) FROM users WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    public void update(User user) {
        String sql = "UPDATE users SET name = ?, email = ?, password = ?, role = ?, enabled = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.isEnabled(),
                user.getId()
        );
    }

    public void delete(UUID userId) {
        String deleteStores = "DELETE FROM stores WHERE owner_id = ?";
        jdbcTemplate.update(deleteStores, userId);

        String deleteSubscriptions = "DELETE FROM subscriptions WHERE user_id = ?";
        jdbcTemplate.update(deleteSubscriptions, userId);

        String deleteRefreshTokens = "DELETE FROM refresh_tokens WHERE user_id = ?";
        jdbcTemplate.update(deleteRefreshTokens, userId);

        String deleteEmailTokens = "DELETE FROM email_verification_token WHERE user_id = ?";
        jdbcTemplate.update(deleteEmailTokens, userId);

        String deleteUser = "DELETE FROM users WHERE id = ?";
        jdbcTemplate.update(deleteUser, userId);
    }
}
