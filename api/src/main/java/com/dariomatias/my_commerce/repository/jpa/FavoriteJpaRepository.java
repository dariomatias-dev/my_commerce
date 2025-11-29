package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.FavoriteRepository;
import com.dariomatias.my_commerce.repository.contract.FavoriteContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class FavoriteJpaRepository implements FavoriteContract {

    private final FavoriteRepository repository;

    public FavoriteJpaRepository(FavoriteRepository repository) {
        this.repository = repository;
    }

    @Override
    public Favorite save(Favorite favorite) {
        return repository.save(favorite);
    }

    @Override
    public Page<Favorite> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<Favorite> findAllByUserId(UUID userId, Pageable pageable) {
        User user = new User();
        user.setId(userId);
        return repository.findAllByUser(user, pageable);
    }

    @Override
    public Page<Favorite> findAllByProductId(UUID productId, Pageable pageable) {
        Product product = new Product();
        product.setId(productId);
        return repository.findAllByProduct(product, pageable);
    }

    @Override
    public Optional<Favorite> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
