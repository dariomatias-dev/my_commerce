package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.repository.jdbc.UserJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class UserAdapter {

    private final UserRepository userRepository;
    private final UserJdbcRepository userJdbcRepository;
    private final boolean useJdbc;

    public UserAdapter(UserRepository userRepository,
                       UserJdbcRepository userJdbcRepository,
                       @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.userRepository = userRepository;
        this.userJdbcRepository = userJdbcRepository;
        this.useJdbc = useJdbc;
    }

    public User save(User user) {
        return useJdbc
                ? userJdbcRepository.save(user)
                : userRepository.save(user);
    }

    public void update(User user) {
        if (useJdbc) userJdbcRepository.update(user);
        else userRepository.save(user);
    }

    public void delete(UUID id) {
        User user = findById(id).orElseThrow();
        user.delete();
        update(user);
    }

    public boolean existsById(UUID id) {
        return useJdbc
                ? userJdbcRepository.existsById(id)
                : userRepository.existsById(id);
    }

    public Optional<User> findById(UUID id) {
        return useJdbc
                ? userJdbcRepository.findById(id)
                : userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return useJdbc
                ? userJdbcRepository.findByEmail(email)
                : userRepository.findByEmail(email);
    }

    public Page<User> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<User> list = userJdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return userRepository.findAll(pageable);
        }
    }
}
