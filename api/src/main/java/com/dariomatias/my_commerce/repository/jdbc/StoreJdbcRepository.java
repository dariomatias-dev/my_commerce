package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.Store;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class StoreJdbcRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public StoreJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Store> mapper = (rs, rowNum) -> {
        Store store = new Store();
        store.setId(UUID.fromString(rs.getString("id")));
        store.setName(rs.getString("name"));
        store.setSlug(rs.getString("slug"));
        store.setDescription(rs.getString("description"));
        store.setBannerUrl(rs.getString("banner_url"));
        store.setLogoUrl(rs.getString("logo_url"));
        store.setThemeColor(rs.getString("theme_color"));
        store.setIsActive(rs.getBoolean("is_active"));
        store.setOwnerId(UUID.fromString(rs.getString("owner_id")));
        store.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        store.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return store;
    };

    public Store save(Store store) {
        LocalDateTime now = LocalDateTime.now();
        UUID id = UUID.randomUUID();

        String sql = """
            INSERT INTO stores (id, name, slug, description, banner_url, logo_url, theme_color, is_active, owner_id, created_at, updated_at)
            VALUES (:id, :name, :slug, :description, :banner_url, :logo_url, :theme_color, :is_active, :owner_id, :created_at, :updated_at)
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", store.getName())
                .addValue("slug", store.getSlug())
                .addValue("description", store.getDescription())
                .addValue("banner_url", store.getBannerUrl())
                .addValue("logo_url", store.getLogoUrl())
                .addValue("theme_color", store.getThemeColor())
                .addValue("is_active", store.getIsActive())
                .addValue("owner_id", store.getOwner().getId())
                .addValue("created_at", now)
                .addValue("updated_at", now);

        jdbc.update(sql, params);

        store.setId(id);
        store.setCreatedAt(now);
        store.setUpdatedAt(now);

        return store;
    }

    public List<Store> findAll(int offset, int limit) {
        String sql = "SELECT * FROM stores ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("offset", offset)
                .addValue("limit", limit), mapper);
    }

    public List<Store> findAllByOwnerId(UUID ownerId, int offset, int limit) {
        String sql = "SELECT * FROM stores WHERE owner_id = :owner_id ORDER BY created_at DESC OFFSET :offset LIMIT :limit";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("owner_id", ownerId)
                .addValue("offset", offset)
                .addValue("limit", limit), mapper);
    }

    public Optional<Store> findById(UUID id) {
        String sql = "SELECT * FROM stores WHERE id = :id";
        List<Store> list = jdbc.query(sql, new MapSqlParameterSource("id", id), mapper);
        return list.stream().findFirst();
    }

    public Optional<Store> findBySlug(String slug) {
        String sql = "SELECT * FROM stores WHERE slug = :slug";
        List<Store> list = jdbc.query(sql, new MapSqlParameterSource("slug", slug), mapper);
        return list.stream().findFirst();
    }

    public void update(Store store) {
        LocalDateTime now = LocalDateTime.now();

        String sql = """
            UPDATE stores
            SET name = :name,
                slug = :slug,
                description = :description,
                banner_url = :banner_url,
                logo_url = :logo_url,
                theme_color = :theme_color,
                is_active = :is_active,
                updated_at = :updated_at
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", store.getId())
                .addValue("name", store.getName())
                .addValue("slug", store.getSlug())
                .addValue("description", store.getDescription())
                .addValue("banner_url", store.getBannerUrl())
                .addValue("logo_url", store.getLogoUrl())
                .addValue("theme_color", store.getThemeColor())
                .addValue("is_active", store.getIsActive())
                .addValue("updated_at", now);

        jdbc.update(sql, params);
        store.setUpdatedAt(now);
    }

    public void delete(UUID id) {
        String sql = "DELETE FROM stores WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }
}
