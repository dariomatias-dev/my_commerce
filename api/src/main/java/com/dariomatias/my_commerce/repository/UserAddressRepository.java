package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {

    List<UserAddress> findAllByUserIdAndDeletedAtIsNull(UUID userId);

    boolean existsByIdAndDeletedAtIsNull(UUID id);
}
