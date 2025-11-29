package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class UserJdbcRepository implements UserContract {

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

        user.getAudit().setCreatedAt(
                rs.getTimestamp("created_at").toLocalDateTime()
        );

        user.setEnabled(rs.getBoolean("enabled"));

        return user;
    }

    @Override
    public User save(User user) {
        if (user.getId() == null) user.setId(UUID.randomUUID());
        if (user.getAudit().getCreatedAt() == null)
            user.getAudit().setCreatedAt(LocalDateTime.now());
        if (user.getRole() == null) user.setRole(UserRole.USER);

        String sql = """
            INSERT INTO users (id, name, email, password, role, created_at, enabled)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;

        jdbcTemplate.update(sql,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().name(),
                user.getAudit().getCreatedAt(),
                user.isEnabled()
        );

        return user;
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        String sql = "SELECT * FROM users ORDER BY name LIMIT ? OFFSET ?";
        List<User> list = jdbcTemplate.query(sql, rowMapper, pageable.getPageSize(), offset);

        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Optional<User> findById(UUID id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        var list = jdbcTemplate.query(sql, rowMapper, id);
        return list.stream().findFirst();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        var list = jdbcTemplate.query(sql, rowMapper, email);
        return list.stream().findFirst();
    }

    @Override
    public boolean existsById(UUID id) {
        String sql = "SELECT COUNT(*) FROM users WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    @Override
    public User update(User user) {
        String sql = """
           UPDATE users 
           SET name = ?, email = ?, password = ?, role = ?, enabled = ?, deleted_at = ?
           WHERE id = ?
        """;

        jdbcTemplate.update(sql,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().name(),
                user.isEnabled(),
                user.getDeletedAt(),
                user.getId()
        );

        return user;
    }

    @Override
    public void deleteById(UUID id) {
        User user = findById(id).orElseThrow();
        user.delete();
        update(user);
    }
}
