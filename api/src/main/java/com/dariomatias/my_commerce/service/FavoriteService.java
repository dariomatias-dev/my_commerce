package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.favorite.FavoriteRequestDTO;
import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.repository.contract.FavoriteContract;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
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

    private final FavoriteContract favoriteRepository;
    private final UserContract userRepository;
    private final ProductContract productRepository;

    public FavoriteService(FavoriteContract favoriteRepository,
                           UserContract userRepository,
                           ProductContract productRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Favorite create(FavoriteRequestDTO request) {
        getUserOrThrow(request.getUserId());
        getProductOrThrow(request.getProductId());

        Favorite favorite = new Favorite();
        favorite.setUserId(request.getUserId());
        favorite.setProductId(request.getProductId());

        return favoriteRepository.save(favorite);
    }

    public Page<Favorite> getAll(Pageable pageable) {
        return favoriteRepository.findAll(pageable);
    }

    public Page<Favorite> getAllByUser(UUID userId, Pageable pageable) {
        getUserOrThrow(userId);
        return favoriteRepository.findAllByUserId(userId, pageable);
    }

    public Page<Favorite> getAllByProduct(UUID productId, Pageable pageable) {
        getProductOrThrow(productId);
        return favoriteRepository.findAllByProductId(productId, pageable);
    }

    public Favorite getById(UUID id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorito não encontrado"));
    }

    public void delete(UUID id) {
        favoriteRepository.delete(id);
    }

    private void getUserOrThrow(UUID userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private void getProductOrThrow(UUID productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }
}
