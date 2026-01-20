package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.OrderAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderAddressRepository extends JpaRepository<OrderAddress, UUID> { }
