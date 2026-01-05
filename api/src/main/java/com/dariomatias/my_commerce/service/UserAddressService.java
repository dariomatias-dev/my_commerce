package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.address.UserAddressRequestDTO;
import com.dariomatias.my_commerce.dto.address.UserAddressResponseDTO;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserAddressService {

    private final UserAddressContract repository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public UserAddressService(UserAddressContract repository) {
        this.repository = repository;
    }

    public UserAddressResponseDTO create(User user, UserAddressRequestDTO request) {
        UserAddress address = buildAddress(user, request, null);
        UserAddress saved = repository.save(address);

        return UserAddressResponseDTO.from(saved);
    }

    public UserAddressResponseDTO update(User user, UUID addressId, UserAddressRequestDTO request) {
        UserAddress existing = getAddressById(addressId);

        checkOwnership(user, existing);

        UserAddress updated = buildAddress(user, request, existing);

        repository.update(updated);

        return UserAddressResponseDTO.from(updated);
    }

    public List<UserAddressResponseDTO> getAllByUser(User user) {
        return repository.findAllByUserId(user.getId())
                .stream()
                .map(UserAddressResponseDTO::from)
                .toList();
    }

    public void delete(User user, UUID addressId) {
        UserAddress address = getAddressById(addressId);
        checkOwnership(user, address);
        address.delete();

        repository.update(address);
    }

    private UserAddress buildAddress(User user, UserAddressRequestDTO request, UserAddress existing) {
        Point location = geometryFactory.createPoint(new Coordinate(request.longitude(), request.latitude()));

        UserAddress address = existing != null ? existing : new UserAddress();
        address.setLabel(request.label());
        address.setStreet(request.street());
        address.setNumber(request.number());
        address.setComplement(request.complement());
        address.setNeighborhood(request.neighborhood());
        address.setCity(request.city());
        address.setState(request.state());
        address.setZip(request.zip());
        address.setLocation(location);
        address.setUser(user);

        return address;
    }

    private UserAddress getAddressById(UUID addressId) {
        return repository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado"));
    }

    private void checkOwnership(User user, UserAddress address) {
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Endereço não pertence ao usuário");
        }
    }
}
