package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.favorite.FavoriteRequestDTO;
import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.FavoriteAdapter;
import com.dariomatias.my_commerce.repository.adapter.ProductAdapter;
import com.dariomatias.my_commerce.repository.adapter.UserAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@Transactional
public class FavoriteService {

    private final FavoriteAdapter favoriteAdapter;
    private final UserAdapter userAdapter;
    private final ProductAdapter productAdapter;

    public FavoriteService(FavoriteAdapter favoriteAdapter, UserAdapter userAdapter, ProductAdapter productAdapter) {
        this.favoriteAdapter = favoriteAdapter;
        this.userAdapter = userAdapter;
        this.productAdapter = productAdapter;
    }

    public Favorite create(FavoriteRequestDTO request) {
        User user = userAdapter.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        Product product = productAdapter.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setProduct(product);

        return favoriteAdapter.save(favorite);
    }

    public Page<Favorite> getAll(Pageable pageable) {
        return favoriteAdapter.findAll(pageable);
    }

    public Page<Favorite> getAllByUser(UUID userId, Pageable pageable) {
        User user = userAdapter.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return favoriteAdapter.findAllByUser(user, pageable);
    }

    public Page<Favorite> getAllByProduct(UUID productId, Pageable pageable) {
        Product product = productAdapter.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
        return favoriteAdapter.findAllByProduct(product, pageable);
    }

    public Favorite getById(UUID id) {
        return favoriteAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorito não encontrado"));
    }

    public void delete(UUID id) {
        favoriteAdapter.delete(id);
    }
}
