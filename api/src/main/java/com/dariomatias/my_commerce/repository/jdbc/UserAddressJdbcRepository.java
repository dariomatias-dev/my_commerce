package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class UserAddressJdbcRepository implements UserAddressContract {

    private final NamedParameterJdbcTemplate jdbc;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public UserAddressJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<UserAddress> rowMapper = this::mapAddress;

    private UserAddress mapAddress(ResultSet rs, int rowNum) throws SQLException {
        UserAddress address = new UserAddress();

        address.setId(UUID.fromString(rs.getString("id")));
        address.setLabel(rs.getString("label"));
        address.setStreet(rs.getString("street"));
        address.setNumber(rs.getString("number"));
        address.setComplement(rs.getString("complement"));
        address.setNeighborhood(rs.getString("neighborhood"));
        address.setCity(rs.getString("city"));
        address.setState(rs.getString("state"));
        address.setZip(rs.getString("zip"));
        address.setUserId(UUID.fromString(rs.getString("user_id")));

        double lon = rs.getDouble("lon");
        double lat = rs.getDouble("lat");
        Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
        address.setLocation(point);

        address.setDeletedAt(
                rs.getTimestamp("deleted_at") != null
                        ? rs.getTimestamp("deleted_at").toLocalDateTime()
                        : null
        );

        return address;
    }

    @Override
    public UserAddress save(UserAddress address) {
        if (address.getId() == null) {
            address.setId(UUID.randomUUID());
        }

        String sql = """
            INSERT INTO user_addresses
            (id, label, street, number, complement, neighborhood, city, state, zip, location, user_id, deleted_at)
            VALUES (:id, :label, :street, :number, :complement, :neighborhood, :city, :state, :zip,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :userId, :deletedAt)
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", address.getId())
                .addValue("label", address.getLabel())
                .addValue("street", address.getStreet())
                .addValue("number", address.getNumber())
                .addValue("complement", address.getComplement())
                .addValue("neighborhood", address.getNeighborhood())
                .addValue("city", address.getCity())
                .addValue("state", address.getState())
                .addValue("zip", address.getZip())
                .addValue("lon", address.getLocation().getX())
                .addValue("lat", address.getLocation().getY())
                .addValue("userId", address.getUserId())
                .addValue("deletedAt", address.getDeletedAt());

        jdbc.update(sql, params);

        return address;
    }

    @Override
    public Page<UserAddress> findAll(Pageable pageable) {
        int offset = (int) pageable.getOffset();

        String sql = """
            SELECT *,
                   ST_X(location) AS lon,
                   ST_Y(location) AS lat
            FROM user_addresses
            ORDER BY label
            LIMIT :limit OFFSET :offset
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("limit", pageable.getPageSize())
                .addValue("offset", offset);

        List<UserAddress> list = jdbc.query(sql, params, rowMapper);

        String countSql = "SELECT COUNT(*) FROM user_addresses";
        Long total = jdbc.queryForObject(countSql, new MapSqlParameterSource(), Long.class);

        return new PageImpl<>(list, pageable, total);
    }

    @Override
    public Optional<UserAddress> findById(UUID id) {
        String sql = """
            SELECT *,
                   ST_X(location) AS lon,
                   ST_Y(location) AS lat
            FROM user_addresses
            WHERE id = :id
        """;

        List<UserAddress> list = jdbc.query(sql, new MapSqlParameterSource("id", id), rowMapper);

        return list.stream().findFirst();
    }

    @Override
    public List<UserAddress> findAllByUserId(UUID userId) {
        String sql = """
            SELECT *,
                   ST_X(location) AS lon,
                   ST_Y(location) AS lat
            FROM user_addresses
            WHERE user_id = :userId
              AND deleted_at IS NULL
        """;

        return jdbc.query(sql, new MapSqlParameterSource("userId", userId), rowMapper);
    }

    @Override
    public Double calculateDistanceFromPoint(UUID id, double lat, double lon) {
        String sql = """
            SELECT ST_DistanceSphere(
                ST_MakePoint(:lon, :lat),
                location
            )
            FROM user_addresses
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("lon", lon)
                .addValue("lat", lat)
                .addValue("id", id);

        return jdbc.queryForObject(sql, params, Double.class);
    }

    @Override
    public UserAddress update(UserAddress address) {
        String sql = """
            UPDATE user_addresses SET
                label = :label,
                street = :street,
                number = :number,
                complement = :complement,
                neighborhood = :neighborhood,
                city = :city,
                state = :state,
                zip = :zip,
                location = ST_SetSRID(ST_MakePoint(:lon, :lat), 4326),
                deleted_at = :deletedAt
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("label", address.getLabel())
                .addValue("street", address.getStreet())
                .addValue("number", address.getNumber())
                .addValue("complement", address.getComplement())
                .addValue("neighborhood", address.getNeighborhood())
                .addValue("city", address.getCity())
                .addValue("state", address.getState())
                .addValue("zip", address.getZip())
                .addValue("lon", address.getLocation().getX())
                .addValue("lat", address.getLocation().getY())
                .addValue("deletedAt", address.getDeletedAt())
                .addValue("id", address.getId());

        jdbc.update(sql, params);

        return address;
    }

    @Override
    public void deleteById(UUID id) {
        UserAddress address = findById(id).orElseThrow();
        address.delete();
        update(address);
    }
}
