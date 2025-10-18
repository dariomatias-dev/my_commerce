package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.SubscriptionRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.repository.SubscriptionPlanRepository;
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

    private final SubscriptionRepository repository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;

    public SubscriptionService(SubscriptionRepository repository,
                               UserRepository userRepository,
                               SubscriptionPlanRepository planRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    public Subscription create(SubscriptionRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano não encontrado"));

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(request.getStartDate());
        subscription.setEndDate(request.getEndDate());
        subscription.setIsActive(request.getIsActive());

        return repository.save(subscription);
    }

    public Page<Subscription> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<Subscription> getAllByUser(UUID userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return repository.findAllByUser(user, pageable);
    }

    public Subscription getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assinatura não encontrada"));
    }

    public Subscription update(UUID id, SubscriptionRequestDTO request) {
        Subscription subscription = getById(id);

        if (request.getStartDate() != null) subscription.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) subscription.setEndDate(request.getEndDate());
        if (request.getIsActive() != null) subscription.setIsActive(request.getIsActive());

        return repository.save(subscription);
    }

    public void delete(UUID id) {
        Subscription subscription = getById(id);
        repository.delete(subscription);
    }
}
