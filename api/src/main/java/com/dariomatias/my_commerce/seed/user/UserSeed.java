package com.dariomatias.my_commerce.seed.user;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserSeed {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String BASE_PASSWORD = "Admin@123";

    public UserSeed(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createUsers() {
        List<UserRole> roles = List.of(
                UserRole.USER,
                UserRole.SUBSCRIBER,
                UserRole.ADMIN
        );

        for (int i = 1; i <= 30; i++) {
            String email = "user" + i + "@gmail.com";

            if (userRepository.existsByEmail(email)) {
                continue;
            }

            UserRole role = roles.get((i - 1) % roles.size());

            User user = new User();
            user.setName("Usuário " + i);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(BASE_PASSWORD + i));
            user.setRole(role);

            if (i % 10 == 0) {
                user.delete();
            } else {
                user.setEnabled(i % 7 != 0);
            }

            userRepository.save(user);
        }
    }
}
