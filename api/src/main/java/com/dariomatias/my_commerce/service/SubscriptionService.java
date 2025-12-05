package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.contract.SubscriptionContract;
import com.dariomatias.my_commerce.repository.contract.SubscriptionPlanContract;
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

    private final SubscriptionContract subscriptionRepository;
    private final SubscriptionPlanContract subscriptionPlanRepository;

    public SubscriptionService(
            SubscriptionContract subscriptionRepository,
            SubscriptionPlanContract subscriptionPlanRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    public Subscription create(User user, SubscriptionRequestDTO request) {

        Page<Subscription> subscriptions =
                subscriptionRepository.findAllByUser(user.getId(), Pageable.unpaged());

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

        return subscriptionRepository.save(subscription);
    }

    public Page<Subscription> getAll(Pageable pageable) {
        return subscriptionRepository.findAll(pageable);
    }

    public Page<Subscription> getAllByUser(UUID userId, Pageable pageable) {
        return subscriptionRepository.findAllByUser(userId, pageable);
    }

    public Subscription getById(UUID id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Assinatura não encontrada")
                );
    }

    public Subscription changePlan(User user, SubscriptionRequestDTO request) {

        Page<Subscription> subscriptions =
                subscriptionRepository.findAllByUser(user.getId(), Pageable.unpaged());

        Subscription active = subscriptions.stream()
                .filter(Subscription::getIsActive)
                .findFirst()
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nenhuma assinatura ativa encontrada")
                );

        if (active.getPlanId().equals(request.getPlanId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O usuário já está nesse plano");
        }

        active.setIsActive(false);
        subscriptionRepository.update(active);

        SubscriptionPlan plan = getPlanOrThrow(request.getPlanId());

        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(30);

        Subscription newSubscription = new Subscription();
        newSubscription.setUser(user);
        newSubscription.setPlan(plan);
        newSubscription.setUserId(user.getId());
        newSubscription.setPlanId(plan.getId());
        newSubscription.setStartDate(start);
        newSubscription.setEndDate(end);
        newSubscription.setIsActive(true);

        return subscriptionRepository.save(newSubscription);
    }

    public void delete(UUID id) {
        subscriptionRepository.deleteById(id);
    }

    private SubscriptionPlan getPlanOrThrow(UUID planId) {
        return subscriptionPlanRepository.findById(planId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano de assinatura não encontrado")
                );
    }
}
