package com.dariomatias.my_commerce.model;

import com.dariomatias.my_commerce.model.shared.Address;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.util.UUID;

@Entity
@Table(name = "order_addresses")
@Getter
@Setter
public class OrderAddress extends Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "geometry(Point, 4326)", nullable = false)
    private Point location;
}

