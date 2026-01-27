package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.dto.user.UserFilterDTO;
import com.dariomatias.my_commerce.dto.user.UserRequest;
import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.ProductContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {

    private final UserContract userRepository;
    private final StoreContract storeRepository;
    private final ProductContract productRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final MinioService minioService;

    private static final String EMAIL_VERIFICATION_PREFIX = "email_verification:";
    private static final String PASSWORD_RECOVERY_PREFIX = "password_recovery:";

    public UserService(
            UserContract userRepository,
            StoreContract storeRepository,
            ProductContract productRepository,
            RedisTemplate<String, Object> redisTemplate,
            PasswordEncoder passwordEncoder,
            MinioService minioService
    ) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.productRepository = productRepository;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
        this.minioService = minioService;
    }

    public Page<User> getAll(UserFilterDTO filter, Pageable pageable) {
        return userRepository.findAll(filter, pageable);
    }

    public User getById(User authenticatedUser, UUID id) {
        return getUserOrThrow(authenticatedUser, id);
    }

    public long getActiveUsersCount() {
        return userRepository.countByEnabledTrueAndDeletedAtIsNull();
    }

    public User update(User authenticatedUser, UUID id, UserRequest updatedUser) {
        User user = getUserOrThrow(authenticatedUser, id);

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }

        return userRepository.update(user);
    }

    public void changePassword(User authenticatedUser, UUID userId, PasswordUpdateRequest request) {
        User user = getUserOrThrow(authenticatedUser, userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual é incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.update(user);
    }

    @Transactional
    public void delete(User authenticatedUser, UUID id) {
        User user = getUserOrThrow(authenticatedUser, id);

        List<Store> stores = storeRepository.findAllByUserId(id);
        for (Store store : stores) {
            minioService.deleteFolder("stores", store.getSlug() + "/");
            productRepository.deleteByStoreId(store.getId());
        }

        storeRepository.deleteByUserId(id);

        user.delete();
        invalidateUserTokens(id);

        userRepository.update(user);
    }

    private User getUserOrThrow(User authenticatedUser, UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (user.isDeleted()) {
            if (authenticatedUser.getRole() == UserRole.ADMIN) {
                return user;
            }

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }

        return user;
    }

    private void invalidateUserTokens(UUID userId) {
        Set<String> keys = redisTemplate.keys("*");
        if (keys.isEmpty()) {
            return;
        }

        keys.stream()
                .filter(key -> {
                    if (key.startsWith(EMAIL_VERIFICATION_PREFIX) || key.startsWith(PASSWORD_RECOVERY_PREFIX)) {
                        return false;
                    }
                    Object value = redisTemplate.opsForValue().get(key);
                    return userId.toString().equals(value);
                })
                .forEach(redisTemplate::delete);
    }
}
