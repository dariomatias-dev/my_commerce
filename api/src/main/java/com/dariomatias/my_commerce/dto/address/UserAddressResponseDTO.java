package com.dariomatias.my_commerce.dto.address;

import com.dariomatias.my_commerce.model.UserAddress;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class UserAddressResponseDTO {

    private UUID id;
    private String label;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String city;
    private String state;
    private String zip;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserAddressResponseDTO(
            UUID id,
            String label,
            String street,
            String number,
            String complement,
            String neighborhood,
            String city,
            String state,
            String zip,
            Double latitude,
            Double longitude,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
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
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UserAddressResponseDTO from(UserAddress address) {
        return new UserAddressResponseDTO(
                address.getId(),
                address.getLabel(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getCity(),
                address.getState(),
                address.getZip(),
                address.getLocation().getY(),
                address.getLocation().getX(),
                address.getAudit().getCreatedAt(),
                address.getAudit().getUpdatedAt()
        );
    }
}
