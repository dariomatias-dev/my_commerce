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
public class OrderAddressJdbcRepository implements OrderAddressContract {

    private final NamedParameterJdbcTemplate jdbc;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public OrderAddressJdbcRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
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
            VALUES (:id, :label, :street, :number, :complement, :neighborhood, :city, :state, :zip,
                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", orderAddress.getId())
                .addValue("label", orderAddress.getLabel())
                .addValue("street", orderAddress.getStreet())
                .addValue("number", orderAddress.getNumber())
                .addValue("complement", orderAddress.getComplement())
                .addValue("neighborhood", orderAddress.getNeighborhood())
                .addValue("city", orderAddress.getCity())
                .addValue("state", orderAddress.getState())
                .addValue("zip", orderAddress.getZip())
                .addValue("lon", orderAddress.getLocation().getX())
                .addValue("lat", orderAddress.getLocation().getY());

        jdbc.update(sql, params);

        return orderAddress;
    }

    @Override
    public Page<OrderAddress> findAll(Pageable pageable) {
        int offset = (int) pageable.getOffset();

        String sql = """
            SELECT *,
                   ST_X(location) AS lon,
                   ST_Y(location) AS lat
            FROM order_addresses
            ORDER BY created_at
            LIMIT :limit OFFSET :offset
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("limit", pageable.getPageSize())
                .addValue("offset", offset);

        List<OrderAddress> list = jdbc.query(sql, params, rowMapper);

        String countSql = "SELECT COUNT(*) FROM order_addresses";
        Long total = jdbc.queryForObject(countSql, new MapSqlParameterSource(), Long.class);

        return new PageImpl<>(list, pageable, total);
    }

    @Override
    public Optional<OrderAddress> findById(UUID id) {
        String sql = """
            SELECT *,
                   ST_X(location) AS lon,
                   ST_Y(location) AS lat
            FROM order_addresses
            WHERE id = :id
        """;

        List<OrderAddress> list = jdbc.query(sql, new MapSqlParameterSource("id", id), rowMapper);

        return list.stream().findFirst();
    }

    @Override
    public OrderAddress update(OrderAddress orderAddress) {
        String sql = """
            UPDATE order_addresses SET
                label = :label,
                street = :street,
                number = :number,
                complement = :complement,
                neighborhood = :neighborhood,
                city = :city,
                state = :state,
                zip = :zip,
                location = ST_SetSRID(ST_MakePoint(:lon, :lat), 4326),
                updated_at = :updatedAt
            WHERE id = :id
        """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("label", orderAddress.getLabel())
                .addValue("street", orderAddress.getStreet())
                .addValue("number", orderAddress.getNumber())
                .addValue("complement", orderAddress.getComplement())
                .addValue("neighborhood", orderAddress.getNeighborhood())
                .addValue("city", orderAddress.getCity())
                .addValue("state", orderAddress.getState())
                .addValue("zip", orderAddress.getZip())
                .addValue("lon", orderAddress.getLocation().getX())
                .addValue("lat", orderAddress.getLocation().getY())
                .addValue("updatedAt", LocalDateTime.now())
                .addValue("id", orderAddress.getId());

        jdbc.update(sql, params);

        return orderAddress;
    }

    @Override
    public void deleteById(UUID id) {
        findById(id).orElseThrow();
        String sql = "DELETE FROM order_addresses WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource("id", id));
    }
}
