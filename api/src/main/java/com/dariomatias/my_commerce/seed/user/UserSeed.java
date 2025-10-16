package com.dariomatias.my_commerce.seed.user;

import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserSeed {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeed(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createUsers() {
        for (int i = 1; i <= 20; i++) {
            String email = "user" + i + "@gmail.com";
            String name = "Usuário " + i;
            String password = "password" + i;

            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                continue;
            }

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("USER");
            user.setEnabled(true);

            userRepository.save(user);
        }
    }
}
