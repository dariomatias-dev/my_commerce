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

    public Subscription create(SubscriptionRequestDTO request) {
        Subscription subscription = new Subscription();
        subscription.setUser(getUserOrThrow(request.getUserId()));
        subscription.setPlan(getPlanOrThrow(request.getPlanId()));
        subscription.setUserId(request.getUserId());
        subscription.setPlanId(request.getPlanId());
        subscription.setStartDate(request.getStartDate());
        subscription.setEndDate(request.getEndDate());
        subscription.setIsActive(request.getIsActive());
        return adapter.save(subscription);
    }

    public Subscription update(UUID id, SubscriptionRequestDTO request) {
        Subscription subscription = getById(id);

        if (request.getUserId() != null) subscription.setUser(getUserOrThrow(request.getUserId()));
        if (request.getPlanId() != null) subscription.setPlan(getPlanOrThrow(request.getPlanId()));
        if (request.getStartDate() != null) subscription.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) subscription.setEndDate(request.getEndDate());
        if (request.getIsActive() != null) subscription.setIsActive(request.getIsActive());

        subscription.setUserId(subscription.getUser().getId());
        subscription.setPlanId(subscription.getPlan().getId());

        return adapter.update(subscription);
    }

    public Subscription getById(UUID id) {
        return adapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assinatura não encontrada"));
    }

    public Page<Subscription> getAll(Pageable pageable) {
        return adapter.findAll(pageable);
    }

    public Page<Subscription> getAllByUser(UUID userId, Pageable pageable) {
        return adapter.findAllByUser(getUserOrThrow(userId), pageable);
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
