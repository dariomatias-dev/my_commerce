package com.dariomatias.my_commerce.repository.contract;

import com.dariomatias.my_commerce.model.User;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.UUID;

public interface UserContract {
    User save(User user);

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    Page<User> findAll(Pageable pageable);

    boolean existsById(UUID id);

    boolean existsByEmail(String email);

    User update(User user);

    void delete(UUID id);
}
