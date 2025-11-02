package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {

    Optional<Store> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<Store> findAllByUser(User user, Pageable pageable);
}
