package com.dariomatias.my_commerce.seed.favorite;

import com.dariomatias.my_commerce.model.Favorite;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.FavoriteRepository;
import com.dariomatias.my_commerce.repository.ProductRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class FavoriteSeed {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public FavoriteSeed(FavoriteRepository favoriteRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void createFavorites() {
        List<User> users = userRepository.findAll();
        List<Product> products = productRepository.findAll();
        if (users.isEmpty() || products.isEmpty()) return;

        int total = Math.min(users.size(), products.size());
        for (int i = 0; i < total; i++) {
            Favorite favorite = new Favorite();
            favorite.setUser(users.get(i));
            favorite.setProduct(products.get(i));
            favorite.setCreatedAt(LocalDateTime.now());
            favoriteRepository.save(favorite);
        }
    }
}
