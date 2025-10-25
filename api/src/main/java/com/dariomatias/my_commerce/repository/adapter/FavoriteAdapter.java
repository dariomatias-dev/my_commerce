package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.FavoriteRepository;
import com.dariomatias.my_commerce.repository.jdbc.FavoriteJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class FavoriteAdapter {

    private final FavoriteRepository repository;
    private final FavoriteJdbcRepository jdbcRepository;
    private final boolean useJdbc;

    public FavoriteAdapter(FavoriteRepository repository,
                           FavoriteJdbcRepository jdbcRepository,
                           @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.repository = repository;
        this.jdbcRepository = jdbcRepository;
        this.useJdbc = useJdbc;
    }

    public Favorite save(Favorite favorite) {
        return useJdbc ? jdbcRepository.save(favorite) : repository.save(favorite);
    }

    public Page<Favorite> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Favorite> list = jdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAll(pageable);
        }
    }

    public Page<Favorite> findAllByUser(User user, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Favorite> list = jdbcRepository.findAllByUserId(user.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAllByUser(user, pageable);
        }
    }

    public Page<Favorite> findAllByProduct(Product product, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Favorite> list = jdbcRepository.findAllByProductId(product.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAllByProduct(product, pageable);
        }
    }

    public Optional<Favorite> findById(UUID id) {
        return useJdbc ? jdbcRepository.findById(id) : repository.findById(id);
    }

    public void delete(UUID id) {
        if (useJdbc) jdbcRepository.deleteById(id);
        else repository.deleteById(id);
    }
}
