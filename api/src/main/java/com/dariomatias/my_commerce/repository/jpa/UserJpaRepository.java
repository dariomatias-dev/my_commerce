package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.dto.user.UserFilterDTO;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.repository.contract.UserContract;
import com.dariomatias.my_commerce.repository.specification.UserSpecification;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
    public Page<User> findAll(UserFilterDTO filter, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> null;

        if (filter != null) {
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                spec = spec.and(UserSpecification.name(filter.getName()));
            }

            if (filter.getEmail() != null && !filter.getEmail().isEmpty()) {
                spec = spec.and(UserSpecification.email(filter.getEmail()));
            }

            if (filter.getRole() != null) {
                spec = spec.and(UserSpecification.role(filter.getRole()));
            }
        }

        spec = spec.and(UserSpecification.active());

        return repository.findAll(spec, pageable);
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
    public long countByEnabledTrueAndDeletedAtIsNull() {
        return repository.countByEnabledTrueAndDeletedAtIsNull();
    }

    @Override
    public long countByEnabledTrueAndDeletedAtIsNullAndAuditCreatedAtAfter(LocalDateTime startDate) {
        return repository.countByEnabledTrueAndDeletedAtIsNullAndAuditCreatedAtAfter(startDate);
    }

    @Override
    public User update(User user) {
        return repository.save(user);
    }

    @Override
    public void delete(UUID id) {
        User user = repository.findById(id)
                .orElseThrow();

        user.delete();

        repository.save(user);
    }
}
