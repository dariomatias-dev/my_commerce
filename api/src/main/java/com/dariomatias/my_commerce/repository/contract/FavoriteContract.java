package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface FavoriteContract {
    Favorite save(Favorite favorite);

    Optional<Favorite> findById(UUID id);

    Page<Favorite> findAll(Pageable pageable);

    Page<Favorite> findAllByUserId(UUID userId, Pageable pageable);

    Page<Favorite> findAllByProductId(UUID productId, Pageable pageable);

    void deleteById(UUID id);
}
