package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jdbc")
public class UserAddressJdbcRepository implements UserAddressContract {

    private final JdbcTemplate jdbcTemplate;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public UserAddressJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<UserAddress> rowMapper = this::mapAddress;

    private UserAddress mapAddress(ResultSet rs, int rowNum) throws SQLException {
        UserAddress address = new UserAddress();
        address.setId(UUID.fromString(rs.getString("id")));
        address.setLabel(rs.getString("label"));
        address.setStreet(rs.getString("street"));
        address.setNeighborhood(rs.getString("neighborhood"));
        address.setCity(rs.getString("city"));
        address.setZip(rs.getString("zip"));

        double longitude = rs.getDouble("longitude");
        double latitude = rs.getDouble("latitude");
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        address.setLocation(point);

        address.setDeletedAt(rs.getTimestamp("deleted_at") != null
                ? rs.getTimestamp("deleted_at").toLocalDateTime()
                : null
        );

        return address;
    }

    @Override
    public UserAddress save(UserAddress address) {
        if (address.getId() == null) address.setId(UUID.randomUUID());

        String sql = """
            INSERT INTO user_addresses 
            (id, label, street, neighborhood, city, zip, longitude, latitude, user_id, deleted_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        jdbcTemplate.update(sql,
                address.getId(),
                address.getLabel(),
                address.getStreet(),
                address.getNeighborhood(),
                address.getCity(),
                address.getZip(),
                address.getLocation().getX(),
                address.getLocation().getY(),
                address.getUser().getId(),
                address.getDeletedAt()
        );

        return address;
    }

    @Override
    public Page<UserAddress> findAll(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        String sql = "SELECT * FROM user_addresses ORDER BY label LIMIT ? OFFSET ?";
        List<UserAddress> list = jdbcTemplate.query(sql, rowMapper, pageable.getPageSize(), offset);
        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Optional<UserAddress> findById(UUID id) {
        String sql = "SELECT * FROM user_addresses WHERE id = ?";
        List<UserAddress> list = jdbcTemplate.query(sql, rowMapper, id);
        return list.stream().findFirst();
    }

    @Override
    public List<UserAddress> findAllByUserId(UUID userId) {
        String sql = "SELECT * FROM user_addresses WHERE user_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    @Override
    public Double calculateDistanceFromPoint(UUID id, double lat, double lon) {
        String sql = """
        SELECT ST_DistanceSphere(
            ST_MakePoint(longitude, latitude),
            ST_MakePoint(?, ?)
        ) 
        FROM user_addresses 
        WHERE id = ?
    """;
        return jdbcTemplate.queryForObject(sql, Double.class, lon, lat, id);
    }

    @Override
    public UserAddress update(UserAddress address) {
        String sql = """
            UPDATE user_addresses SET 
                label = ?, street = ?, neighborhood = ?, city = ?, zip = ?, 
                longitude = ?, latitude = ?, deleted_at = ? 
            WHERE id = ?
        """;

        jdbcTemplate.update(sql,
                address.getLabel(),
                address.getStreet(),
                address.getNeighborhood(),
                address.getCity(),
                address.getZip(),
                address.getLocation().getX(),
                address.getLocation().getY(),
                address.getDeletedAt(),
                address.getId()
        );

        return address;
    }

    @Override
    public void deleteById(UUID id) {
        UserAddress address = findById(id).orElseThrow();
        address.delete();
        update(address);
    }
}
