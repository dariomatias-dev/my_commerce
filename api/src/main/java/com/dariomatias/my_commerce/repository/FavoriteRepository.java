package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    Page<Favorite> findAllByUser(User user, Pageable pageable);

    Page<Favorite> findAllByProduct(Product product, Pageable pageable);
}
