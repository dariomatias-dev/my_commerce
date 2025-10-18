package com.dariomatias.my_commerce.seed.user;

import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;

@Component
public class UserSeed {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeed(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createUsers() {
        for (int i = 1; i <= 20; i++) {
            String email = "user" + i + "@gmail.com";
            if (!userRepository.existsByEmail(email)) {
                User user = new User();
                user.setName("Usuário " + i);
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode("password" + i));
                user.setRole("USER");
                user.setEnabled(true);
                userRepository.save(user);
            }
        }
    }
}
