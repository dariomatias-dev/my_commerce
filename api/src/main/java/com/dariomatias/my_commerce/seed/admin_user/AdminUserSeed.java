package com.dariomatias.my_commerce.seed.admin_user;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.seed.Seed;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminUserSeed implements Seed {

    private static final Logger log = LoggerFactory.getLogger(AdminUserSeed.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Dotenv dotenv;

    public AdminUserSeed(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dotenv = Dotenv.load();
    }

    @Override
    @Transactional
    public void run() {
        createAdminUser();
    }

    public void createAdminUser() {
        String adminPassword = dotenv.get("ADMIN_PASSWORD");

        if (adminPassword == null) {
            log.error("USER_SEED | Variável ADMIN_PASSWORD não configurada no .env");
            throw new RuntimeException("Variável ADMIN_PASSWORD não configurada no .env");
        }

        String adminEmail = "matiastests0@gmail.com";

        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);
        if (existingAdmin.isPresent()) {
            log.info("USER_SEED | Usuário administrativo já existe: {}", adminEmail);
            return;
        }

        User admin = new User();
        admin.setName("Administrador");
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(UserRole.ADMIN);
        admin.setEnabled(true);

        userRepository.save(admin);

        log.info("USER_SEED | Usuário administrativo criado com sucesso: {}", adminEmail);
    }
}
