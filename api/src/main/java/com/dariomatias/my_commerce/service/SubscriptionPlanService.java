package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.subscription_plan.SubscriptionPlanRequestDTO;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.adapter.SubscriptionPlanAdapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@Transactional
public class SubscriptionPlanService {

    private final SubscriptionPlanAdapter adapter;

    public SubscriptionPlanService(SubscriptionPlanAdapter adapter) {
        this.adapter = adapter;
    }

    public SubscriptionPlan create(SubscriptionPlanRequestDTO request) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(request.getName());
        plan.setMaxStores(request.getMaxStores());
        plan.setMaxProducts(request.getMaxProducts());
        plan.setFeatures(request.getFeatures());
        plan.setPrice(request.getPrice());
        return adapter.save(plan);
    }

    public Page<SubscriptionPlan> getAll(Pageable pageable) {
        return adapter.findAll(pageable);
    }

    public SubscriptionPlan getById(UUID id) {
        return adapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plano não encontrado"));
    }

    public SubscriptionPlan update(UUID id, SubscriptionPlanRequestDTO request) {
        SubscriptionPlan plan = getById(id);
        if (request.getName() != null) plan.setName(request.getName());
        if (request.getMaxStores() != null) plan.setMaxStores(request.getMaxStores());
        if (request.getMaxProducts() != null) plan.setMaxProducts(request.getMaxProducts());
        if (request.getFeatures() != null) plan.setFeatures(request.getFeatures());
        if (request.getPrice() != null) plan.setPrice(request.getPrice());
        return adapter.update(plan);
    }

    public void delete(UUID id) {
        adapter.delete(id);
    }
}
