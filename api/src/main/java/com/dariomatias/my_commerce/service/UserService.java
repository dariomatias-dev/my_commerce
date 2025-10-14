package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.ApiResponse;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.EmailVerificationTokenRepository;
import com.dariomatias.my_commerce.repository.RefreshTokenRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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

    public ApiResponse<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ApiResponse.success(200, "Usuários obtidos com sucesso.", users);
    }

    public ApiResponse<User> getUserById(UUID id) {
        return userRepository.findById(id)
                .map(user -> ApiResponse.success(200, "Usuário obtido com sucesso.", user))
                .orElse(ApiResponse.error(404, "Usuário não encontrado."));
    }

    public ApiResponse<User> updateUser(UUID id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    if (updatedUser.getName() != null)
                        user.setName(updatedUser.getName());
                    if (updatedUser.getEmail() != null)
                        user.setEmail(updatedUser.getEmail());
                    if (updatedUser.getPassword() != null)
                        user.setPassword(updatedUser.getPassword());

                    userRepository.save(user);
                    return ApiResponse.success(200, "Usuário atualizado com sucesso.", user);
                })
                .orElse(ApiResponse.error(404, "Usuário não encontrado."));
    }

    @Transactional
    public ApiResponse<Void> deleteUser(UUID id) {
        if (!userRepository.existsById(id))
            return ApiResponse.error(404, "Usuário não encontrado");

        refreshTokenRepository.deleteByUserId(id);
        emailVerificationTokenRepository.deleteByUserId(id);
        userRepository.deleteById(id);

        return ApiResponse.success(204, "Usuário excluído com sucesso", null);
    }
}
