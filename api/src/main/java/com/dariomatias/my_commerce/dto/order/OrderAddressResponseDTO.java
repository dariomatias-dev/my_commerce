package com.dariomatias.my_commerce.dto.order;

import com.dariomatias.my_commerce.model.OrderAddress;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class OrderAddressResponseDTO {

    private UUID id;
    private String label;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String city;
    private String state;
    private String zip;

    public OrderAddressResponseDTO(
            UUID id,
            String label,
            String street,
            String number,
            String complement,
            String neighborhood,
            String city,
            String state,
            String zip
    ) {
        this.id = id;
        this.label = label;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    public static OrderAddressResponseDTO from(OrderAddress address) {
        return new OrderAddressResponseDTO(
                address.getId(),
                address.getLabel(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getCity(),
                address.getState(),
                address.getZip()
        );
    }
}
