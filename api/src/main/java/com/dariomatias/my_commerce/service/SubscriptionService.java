package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.subscription.SubscriptionRequestDTO;
import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.adapter.SubscriptionAdapter;
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

    public SubscriptionService(SubscriptionAdapter adapter, UserAdapter userAdapter) {
        this.adapter = adapter;
        this.userAdapter = userAdapter;
    }

    public Subscription create(SubscriptionRequestDTO request) {
        Subscription s = new Subscription();
        User u = new User();
        u.setId(request.getUserId());
        SubscriptionPlan p = new SubscriptionPlan();
        p.setId(request.getPlanId());
        s.setUser(u);
        s.setPlan(p);
        s.setUserId(request.getUserId());
        s.setPlanId(request.getPlanId());
        s.setStartDate(request.getStartDate());
        s.setEndDate(request.getEndDate());
        s.setIsActive(request.getIsActive());
        return adapter.save(s);
    }

    public Page<Subscription> getAll(Pageable pageable) {
        return adapter.findAll(pageable);
    }

    public Page<Subscription> getAllByUser(UUID userId, Pageable pageable) {
        User user = userAdapter.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        return adapter.findAllByUser(user, pageable);
    }

    public Subscription getById(UUID id) {
        return adapter.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assinatura não encontrada"));
    }

    public Subscription update(UUID id, SubscriptionRequestDTO request) {
        Subscription s = getById(id);
        if (request.getUserId() != null) {
            User u = new User();
            u.setId(request.getUserId());
            s.setUser(u);
            s.setUserId(request.getUserId());
        }
        if (request.getPlanId() != null) {
            SubscriptionPlan p = new SubscriptionPlan();
            p.setId(request.getPlanId());
            s.setPlan(p);
            s.setPlanId(request.getPlanId());
        }
        if (request.getStartDate() != null) s.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) s.setEndDate(request.getEndDate());
        if (request.getIsActive() != null) s.setIsActive(request.getIsActive());

        return adapter.update(s);
    }

    public void delete(UUID id) {
        adapter.delete(id);
    }
}
