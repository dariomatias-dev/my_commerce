package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.dto.user.UserFilterDTO;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.UserContract;
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
public class UserJdbcRepository implements UserContract {

    private final NamedParameterJdbcTemplate jdbc;

    public UserJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<User> mapper = (rs, rowNum) -> {
        User u = new User();
        u.setId(UUID.fromString(rs.getString("id")));
        u.setName(rs.getString("name"));
        u.setEmail(rs.getString("email"));
        u.setPassword(rs.getString("password"));
        u.setRole(UserRole.valueOf(rs.getString("role")));
        u.setEnabled(rs.getBoolean("enabled"));
        u.getAudit().setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        if (rs.getTimestamp("deleted_at") != null) {
            u.setDeletedAt(rs.getTimestamp("deleted_at").toLocalDateTime());
        }
        return u;
    };

    @Override
    public User save(User user) {
        UUID id = user.getId() != null ? user.getId() : UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();
        UserRole role = user.getRole() != null ? user.getRole() : UserRole.USER;

        jdbc.update("""
            INSERT INTO users (id, name, email, password, role, created_at, enabled)
            VALUES (:id, :name, :email, :password, :role, :created_at, :enabled)
        """, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", user.getName())
                .addValue("email", user.getEmail())
                .addValue("password", user.getPassword())
                .addValue("role", role.name())
                .addValue("created_at", now)
                .addValue("enabled", user.isEnabled()));

        user.setId(id);
        user.getAudit().setCreatedAt(now);
        user.setRole(role);

        return user;
    }

    @Override
    public Page<User> findAll(UserFilterDTO filter, Pageable pageable) {
        List<String> conditions = new ArrayList<>();
        MapSqlParameterSource params = new MapSqlParameterSource();

        conditions.add("deleted_at IS NULL");

        if (filter != null) {
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                conditions.add("LOWER(name) LIKE :name");
                params.addValue("name", "%" + filter.getName().toLowerCase() + "%");
            }

            if (filter.getEmail() != null && !filter.getEmail().isEmpty()) {
                conditions.add("LOWER(email) LIKE :email");
                params.addValue("email", "%" + filter.getEmail().toLowerCase() + "%");
            }

            if (filter.getRole() != null) {
                conditions.add("role = :role");
                params.addValue("role", filter.getRole().name());
            }
        }

        String where = String.join(" AND ", conditions);

        String sql = """
            SELECT *
            FROM users
            WHERE %s
            ORDER BY name ASC
            OFFSET :offset LIMIT :limit
        """.formatted(where);

        params.addValue("offset", pageable.getOffset());
        params.addValue("limit", pageable.getPageSize());

        List<User> content = jdbc.query(sql, params, mapper);

        String countSql = """
            SELECT COUNT(*)
            FROM users
            WHERE %s
        """.formatted(where);

        long total = jdbc.queryForObject(countSql, params, Long.class);

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Optional<User> findById(UUID id) {
        String sql = "SELECT * FROM users WHERE id = :id";
        List<User> list = jdbc.query(sql, new MapSqlParameterSource("id", id), mapper);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = :email";
        List<User> list = jdbc.query(sql, new MapSqlParameterSource("email", email), mapper);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public long countByEnabledTrueAndDeletedAtIsNull() {
        String sql = "SELECT COUNT(*) FROM users WHERE enabled = TRUE AND deleted_at IS NULL";
        return jdbc.queryForObject(sql, new MapSqlParameterSource(), Long.class);
    }

    @Override
    public long countByEnabledTrueAndDeletedAtIsNullAndAuditCreatedAtAfter(LocalDateTime startDate) {
        String sql = "SELECT COUNT(*) FROM users WHERE enabled = TRUE AND deleted_at IS NULL AND created_at >= :startDate";
        return jdbc.queryForObject(sql, new MapSqlParameterSource("startDate", startDate), Long.class);
    }

    @Override
    public User update(User user) {
        jdbc.update("""
            UPDATE users
            SET name = :name,
                email = :email,
                password = :password,
                role = :role,
                enabled = :enabled,
                deleted_at = :deleted_at
            WHERE id = :id
        """, new MapSqlParameterSource()
                .addValue("id", user.getId())
                .addValue("name", user.getName())
                .addValue("email", user.getEmail())
                .addValue("password", user.getPassword())
                .addValue("role", user.getRole().name())
                .addValue("enabled", user.isEnabled())
                .addValue("deleted_at", user.getDeletedAt()));

        return user;
    }

    @Override
    public void delete(UUID id) {
        jdbc.update("""
            UPDATE users
            SET deleted_at = :deletedAt,
                enabled = false
            WHERE id = :id
        """, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("deletedAt", LocalDateTime.now()));
    }
}
