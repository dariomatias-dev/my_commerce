package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {

    List<UserAddress> findAllByUser_IdAndDeletedAtIsNull(UUID userId);

    @Query(value = "SELECT ST_DistanceSphere(ST_MakePoint(:lon, :lat), location) " +
            "FROM user_addresses " +
            "WHERE id = :id", nativeQuery = true)
    Double findDistanceFromPoint(@Param("id") UUID id,
                                 @Param("lat") double lat,
                                 @Param("lon") double lon);
}
