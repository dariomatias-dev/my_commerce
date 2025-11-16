package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.SubscriptionAdapter;
import com.dariomatias.my_commerce.repository.adapter.SubscriptionPlanAdapter;
import com.dariomatias.my_commerce.repository.adapter.UserAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class SubscriptionService {

    private final SubscriptionAdapter adapter;
    private final UserAdapter userAdapter;
    private final SubscriptionPlanAdapter planAdapter;

    public SubscriptionService(SubscriptionAdapter adapter, UserAdapter userAdapter, SubscriptionPlanAdapter planAdapter) {
        this.adapter = adapter;
        this.userAdapter = userAdapter;
        this.planAdapter = planAdapter;
    }

    public Subscription create(User user, SubscriptionRequestDTO request) {
        Page<Subscription> subscriptions = adapter.findAllByUser(user, Pageable.unpaged());

        boolean hasActive = subscriptions.stream().anyMatch(Subscription::getIsActive);

        if (hasActive) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O usuário já possui uma assinatura ativa");
        }

        SubscriptionPlan plan = getPlanOrThrow(request.getPlanId());

        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(30);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setUserId(user.getId());
        subscription.setPlanId(plan.getId());
        subscription.setStartDate(start);
        subscription.setEndDate(end);
        subscription.setIsActive(true);

        return adapter.save(subscription);
    }

    public Page<Subscription> getAll(Pageable pageable) {
        return adapter.findAll(pageable);
    }

    public Page<Subscription> getAllByUser(UUID userId, Pageable pageable) {
        return adapter.findAllByUser(getUserOrThrow(userId), pageable);
    }

    public Subscription getById(UUID id) {
        return adapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assinatura não encontrada"));
    }

    public void delete(UUID id) {
        adapter.delete(id);
    }

    private User getUserOrThrow(UUID userId) {
        return userAdapter.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    private SubscriptionPlan getPlanOrThrow(UUID planId) {
        return planAdapter.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano de assinatura não encontrado"));
    }
}
