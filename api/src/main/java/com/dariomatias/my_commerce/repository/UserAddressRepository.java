package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {

    List<UserAddress> findAllByUserIdAndDeletedAtIsNull(UUID userId);

    @Query(value = "SELECT ST_DistanceSphere(ST_MakePoint(:lon1, :lat1), location) " +
            "FROM user_addresses " +
            "WHERE id = :id", nativeQuery = true)
    Double findDistanceFromPoint(@Param("id") UUID id,
                                 @Param("lat1") double lat1,
                                 @Param("lon1") double lon1);
}
