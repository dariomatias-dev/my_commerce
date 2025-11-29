package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.favorite.FavoriteRequestDTO;
import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.FavoriteAdapter;
import com.dariomatias.my_commerce.repository.adapter.ProductAdapter;
import com.dariomatias.my_commerce.repository.contract.UserContract;
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
    private final UserContract userRepository;
    private final ProductAdapter productAdapter;

    public FavoriteService(FavoriteAdapter favoriteAdapter, UserContract userRepository, ProductAdapter productAdapter) {
        this.favoriteAdapter = favoriteAdapter;
        this.userRepository = userRepository;
        this.productAdapter = productAdapter;
    }

    public Favorite create(FavoriteRequestDTO request) {
        Favorite favorite = new Favorite();
        favorite.setUser(getUserOrThrow(request.getUserId()));
        favorite.setProduct(getProductOrThrow(request.getProductId()));
        return favoriteAdapter.save(favorite);
    }

    public Page<Favorite> getAll(Pageable pageable) {
        return favoriteAdapter.findAll(pageable);
    }

    public Page<Favorite> getAllByUser(UUID userId, Pageable pageable) {
        return favoriteAdapter.findAllByUser(getUserOrThrow(userId), pageable);
    }

    public Page<Favorite> getAllByProduct(UUID productId, Pageable pageable) {
        return favoriteAdapter.findAllByProduct(getProductOrThrow(productId), pageable);
    }

    public Favorite getById(UUID id) {
        return favoriteAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorito não encontrado"));
    }

    public void delete(UUID id) {
        favoriteAdapter.delete(id);
    }

    private User getUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private Product getProductOrThrow(UUID productId) {
        return productAdapter.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }
}
