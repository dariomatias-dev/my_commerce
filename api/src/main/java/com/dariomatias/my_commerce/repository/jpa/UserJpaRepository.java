package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class UserJpaRepository implements UserContract {

    private final UserRepository repository;

    public UserJpaRepository(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User save(User user) {
        return repository.save(user);
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public User update(User user) {
        return repository.save(user);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
