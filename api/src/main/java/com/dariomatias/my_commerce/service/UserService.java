package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.PasswordUpdateRequest;
import com.dariomatias.my_commerce.dto.user.UserRequest;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.UUID;

@Service
public class UserService {

    private final UserContract userRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserContract userRepository,
                       RedisTemplate<String, Object> redisTemplate,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<User> getAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getById(UUID id) {
        return getUserOrThrow(id);
    }

    public long getActiveUsersCount() {
        return userRepository.countByEnabledTrueAndDeletedAtIsNull();
    }

    public long getNewActiveUsersSinceStartOfMonth() {
        LocalDateTime startOfMonth = YearMonth.now().atDay(1).atStartOfDay();

        return userRepository.countByEnabledTrueAndDeletedAtIsNullAndAuditCreatedAtAfter(startOfMonth);
    }

    public User update(UUID id, UserRequest updatedUser) {
        User user = getUserOrThrow(id);

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }

        return userRepository.update(user);
    }

    public void changePassword(UUID userId, PasswordUpdateRequest request) {
        User user = getUserOrThrow(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha atual é incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.update(user);
    }

    @Transactional
    public void delete(UUID id) {
        User user = getUserOrThrow(id);

        user.delete();

        redisTemplate.keys("*").stream()
                .filter(key -> id.toString().equals(redisTemplate.opsForValue().get(key)))
                .forEach(redisTemplate::delete);

        userRepository.update(user);
    }

    private User getUserOrThrow(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
}
