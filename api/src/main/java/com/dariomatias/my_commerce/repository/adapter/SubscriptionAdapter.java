package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.SubscriptionRepository;
import com.dariomatias.my_commerce.repository.jdbc.SubscriptionJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class SubscriptionAdapter {

    private final SubscriptionRepository repository;
    private final SubscriptionJdbcRepository jdbcRepository;
    private final boolean useJdbc;

    public SubscriptionAdapter(
            SubscriptionRepository repository,
            SubscriptionJdbcRepository jdbcRepository,
            @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.repository = repository;
        this.jdbcRepository = jdbcRepository;
        this.useJdbc = useJdbc;
    }

    public Subscription save(Subscription s) {
        return useJdbc ? jdbcRepository.save(s) : repository.save(s);
    }

    public Page<Subscription> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Subscription> list = jdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAll(pageable);
        }
    }

    public Optional<Subscription> findById(UUID id) {
        return useJdbc ? jdbcRepository.findById(id) : repository.findById(id);
    }

    public Page<Subscription> findAllByUser(User user, Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<Subscription> list = jdbcRepository.findAllByUser(user.getId(), offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAllByUser(user, pageable);
        }
    }

    public Subscription update(Subscription s) {
        if (useJdbc) jdbcRepository.update(s);
        else repository.save(s);
        return s;
    }

    public void delete(UUID id) {
        if (useJdbc) jdbcRepository.deleteById(id);
        else repository.deleteById(id);
    }
}
