package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.UserAddress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserAddressContract {

    UserAddress save(UserAddress address);

    Optional<UserAddress> findById(UUID id);

    Page<UserAddress> findAll(Pageable pageable);

    List<UserAddress> findAllByUserId(UUID userId);

    Double calculateDistanceFromPoint(UUID id, double lat, double lon);

    UserAddress update(UserAddress address);

    void deleteById(UUID id);
}
