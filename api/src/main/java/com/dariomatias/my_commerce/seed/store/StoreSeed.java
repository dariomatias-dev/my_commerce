package com.dariomatias.my_commerce.seed.store;

import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.StoreRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;
import java.util.List;

@Component
public class StoreSeed {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public StoreSeed(StoreRepository storeRepository, UserRepository userRepository) {
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createStores() {
        List<User> users = userRepository.findAll();

        for (int i = 1; i <= 10; i++) {
            String slug = "loja-" + i;
            if (storeRepository.existsBySlug(slug)) continue;

            Store store = new Store();
            store.setName("Loja " + i);
            store.setSlug(slug);
            store.setDescription("Descrição da Loja " + i);
            store.setBannerUrl("https://via.placeholder.com/800x200");
            store.setLogoUrl("https://via.placeholder.com/150");
            store.setThemeColor("#" + Integer.toHexString((int) (Math.random() * 0xFFFFFF)));
            store.setActive(true);
            store.setOwner(users.isEmpty() ? null : users.get(i % users.size()));

            storeRepository.save(store);
        }
    }
}
