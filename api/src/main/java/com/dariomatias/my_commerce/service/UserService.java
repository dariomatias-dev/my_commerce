package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.UserAdapter;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class UserService {

    private final UserAdapter userAdapter;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserAdapter userAdapter,
                       RedisTemplate<String, Object> redisTemplate,
                       PasswordEncoder passwordEncoder) {
        this.userAdapter = userAdapter;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<User> getAll(Pageable pageable) {
        return userAdapter.findAll(pageable);
    }

    public User getById(UUID id) {
        return getUserOrThrow(id);
    }

    public User update(UUID id, User updatedUser) {
        User user = getUserOrThrow(id);
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        userAdapter.update(user);
        return user;
    }

    public void changePassword(UUID userId, PasswordUpdateRequest request) {
        User user = getUserOrThrow(userId);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual é incorreta");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userAdapter.save(user);
    }

    @Transactional
    public void delete(UUID id) {
        User user = getUserOrThrow(id);
        user.delete();
        redisTemplate.keys("*").stream()
                .filter(key -> id.toString().equals(redisTemplate.opsForValue().get(key)))
                .forEach(redisTemplate::delete);
        userAdapter.update(user);
    }

    private User getUserOrThrow(UUID id) {
        return userAdapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
}
