package com.dariomatias.my_commerce.repository.jdbc;

import com.dariomatias.my_commerce.model.OrderAddress;
import com.dariomatias.my_commerce.repository.contract.OrderAddressContract;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
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
public class OrderAddressJdbcRepository implements OrderAddressContract {

    private final JdbcTemplate jdbcTemplate;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public OrderAddressJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<OrderAddress> rowMapper = this::mapAddress;

    private OrderAddress mapAddress(ResultSet rs, int rowNum) throws SQLException {
        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setId(UUID.fromString(rs.getString("id")));
        orderAddress.setLabel(rs.getString("label"));
        orderAddress.setStreet(rs.getString("street"));
        orderAddress.setNumber(rs.getString("number"));
        orderAddress.setComplement(rs.getString("complement"));
        orderAddress.setNeighborhood(rs.getString("neighborhood"));
        orderAddress.setCity(rs.getString("city"));
        orderAddress.setState(rs.getString("state"));
        orderAddress.setZip(rs.getString("zip"));

        double lon = rs.getDouble("lon");
        double lat = rs.getDouble("lat");
        Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
        orderAddress.setLocation(point);

        return orderAddress;
    }

    @Override
    public OrderAddress save(OrderAddress orderAddress) {
        if (orderAddress.getId() == null) {
            orderAddress.setId(UUID.randomUUID());
        }

        String sql = """
            INSERT INTO order_addresses
            (id, label, street, number, complement, neighborhood, city, state, zip, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ST_SetSRID(ST_MakePoint(?, ?), 4326))
        """;

        jdbcTemplate.update(
                sql,
                orderAddress.getId(),
                orderAddress.getLabel(),
                orderAddress.getStreet(),
                orderAddress.getNumber(),
                orderAddress.getComplement(),
                orderAddress.getNeighborhood(),
                orderAddress.getCity(),
                orderAddress.getState(),
                orderAddress.getZip(),
                orderAddress.getLocation().getX(),
                orderAddress.getLocation().getY()
        );

        return orderAddress;
    }

    @Override
    public Page<OrderAddress> findAll(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        String sql = """
            SELECT *,
                   ST_X(location) AS lon,
                   ST_Y(location) AS lat
            FROM order_addresses
            ORDER BY created_at
            LIMIT ? OFFSET ?
        """;

        List<OrderAddress> list = jdbcTemplate.query(sql, rowMapper, pageable.getPageSize(), offset);

        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public Optional<OrderAddress> findById(UUID id) {
        String sql = """
            SELECT *,
                   ST_X(location) AS lon,
                   ST_Y(location) AS lat
            FROM order_addresses
            WHERE id = ?
        """;

        List<OrderAddress> list = jdbcTemplate.query(sql, rowMapper, id);

        return list.stream().findFirst();
    }

    @Override
    public OrderAddress update(OrderAddress orderAddress) {
        String sql = """
            UPDATE order_addresses SET
                label = ?,
                street = ?,
                number = ?,
                complement = ?,
                neighborhood = ?,
                city = ?,
                state = ?,
                zip = ?,
                location = ?,
                updated_at = ?
            WHERE id = ?
        """;

        jdbcTemplate.update(
                sql,
                orderAddress.getLabel(),
                orderAddress.getStreet(),
                orderAddress.getNumber(),
                orderAddress.getComplement(),
                orderAddress.getNeighborhood(),
                orderAddress.getCity(),
                orderAddress.getState(),
                orderAddress.getZip(),
                orderAddress.getLocation(),
                LocalDateTime.now(),
                orderAddress.getId()
        );

        return orderAddress;
    }

    @Override
    public void deleteById(UUID id) {
        OrderAddress orderAddress = findById(id).orElseThrow();
        String sql = "DELETE FROM order_addresses WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
