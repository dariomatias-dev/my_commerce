package com.dariomatias.my_commerce.repository.adapter;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.SubscriptionPlanRepository;
import com.dariomatias.my_commerce.repository.jdbc.SubscriptionPlanJdbcRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class SubscriptionPlanAdapter {

    private final SubscriptionPlanRepository repository;
    private final SubscriptionPlanJdbcRepository jdbcRepository;
    private final boolean useJdbc;

    public SubscriptionPlanAdapter(
            SubscriptionPlanRepository repository,
            SubscriptionPlanJdbcRepository jdbcRepository,
            @Value("${app.useJdbc:false}") boolean useJdbc) {
        this.repository = repository;
        this.jdbcRepository = jdbcRepository;
        this.useJdbc = useJdbc;
    }

    public SubscriptionPlan save(SubscriptionPlan plan) {
        return useJdbc ? jdbcRepository.save(plan) : repository.save(plan);
    }

    public Page<SubscriptionPlan> findAll(Pageable pageable) {
        if (useJdbc) {
            int offset = pageable.getPageNumber() * pageable.getPageSize();
            List<SubscriptionPlan> list = jdbcRepository.findAll(offset, pageable.getPageSize());
            return new PageImpl<>(list, pageable, list.size());
        } else {
            return repository.findAll(pageable);
        }
    }

    public Optional<SubscriptionPlan> findById(UUID id) {
        return useJdbc ? jdbcRepository.findById(id) : repository.findById(id);
    }

    public SubscriptionPlan update(SubscriptionPlan plan) {
        if (useJdbc) jdbcRepository.update(plan);
        else repository.save(plan);
        return plan;
    }

    public void delete(UUID id) {
        if (useJdbc) jdbcRepository.delete(id);
        else {
            repository.deleteById(id);
        }
    }
}
