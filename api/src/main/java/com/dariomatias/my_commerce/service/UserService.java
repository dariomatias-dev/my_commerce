package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.EmailVerificationTokenRepository;
import com.dariomatias.my_commerce.repository.RefreshTokenRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    public UserService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       EmailVerificationTokenRepository emailVerificationTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    public User updateUser(UUID id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    if (updatedUser.getName() != null)
                        user.setName(updatedUser.getName());
                    if (updatedUser.getEmail() != null)
                        user.setEmail(updatedUser.getEmail());
                    if (updatedUser.getPassword() != null)
                        user.setPassword(updatedUser.getPassword());

                    return userRepository.save(user);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }

        refreshTokenRepository.deleteByUserId(id);
        emailVerificationTokenRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }
}
