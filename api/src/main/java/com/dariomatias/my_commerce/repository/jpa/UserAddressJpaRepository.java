package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.UserAddress;
import com.dariomatias.my_commerce.repository.UserAddressRepository;
import com.dariomatias.my_commerce.repository.contract.UserAddressContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@ConditionalOnProperty(name = "app.persistence", havingValue = "jpa", matchIfMissing = true)
public class UserAddressJpaRepository implements UserAddressContract {

    private final UserAddressRepository repository;

    public UserAddressJpaRepository(UserAddressRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserAddress save(UserAddress address) {
        return repository.save(address);
    }

    @Override
    public Page<UserAddress> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<UserAddress> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public List<UserAddress> findAllByUserId(UUID userId) {
        return repository.findAllByUserIdAndDeletedAtIsNull(userId);
    }

    @Override
    public UserAddress update(UserAddress address) {
        return repository.save(address);
    }

    @Override
    public void deleteById(UUID id) {
        repository.findById(id).ifPresent(address -> {
            address.delete();
            repository.save(address);
        });
    }
}
