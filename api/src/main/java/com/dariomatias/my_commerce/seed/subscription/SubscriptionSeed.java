package com.dariomatias.my_commerce.seed.subscription;

import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.SubscriptionPlanRepository;
import com.dariomatias.my_commerce.repository.SubscriptionRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class SubscriptionSeed {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;

    public SubscriptionSeed(SubscriptionRepository subscriptionRepository,
                            UserRepository userRepository,
                            SubscriptionPlanRepository planRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    @Transactional
    public void createSubscriptions() {
        List<User> users = userRepository.findAll();
        List<SubscriptionPlan> plans = planRepository.findAll();

        if (users.isEmpty() || plans.isEmpty()) return;

        for (int i = 0; i < users.size(); i++) {
            Subscription subscription = new Subscription();
            subscription.setUser(users.get(i));
            subscription.setPlan(plans.get(i % plans.size()));
            subscription.setStartDate(LocalDateTime.now());
            subscription.setEndDate(LocalDateTime.now().plusMonths(1));
            subscription.setIsActive(true);

            subscriptionRepository.save(subscription);
        }
    }
}
