package com.dariomatias.my_commerce.seed.subscription;

import com.dariomatias.my_commerce.model.Subscription;
import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.SubscriptionPlanRepository;
import com.dariomatias.my_commerce.repository.SubscriptionRepository;
import com.dariomatias.my_commerce.repository.UserRepository;
import com.dariomatias.my_commerce.seed.Seed;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SubscriptionSeed implements Seed {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionSeed.class);

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;

    public SubscriptionSeed(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            SubscriptionPlanRepository planRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    @Override
    @Transactional
    public void run() {
        log.info("SUBSCRIPTION_SEED | Iniciando criação de assinaturas");
        createSubscriptions();
        log.info("SUBSCRIPTION_SEED | Finalizada criação de assinaturas");
    }

    public void createSubscriptions() {
        List<User> users = userRepository.findAll();
        List<SubscriptionPlan> plans = planRepository.findAll();

        if (users.isEmpty() || plans.isEmpty()) {
            log.warn("SUBSCRIPTION_SEED | Usuários ou planos não encontrados, seed ignorado");
            
            return;
        }

        int subscriptionIndex = 1;

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            SubscriptionPlan plan = plans.get(i % plans.size());

            Subscription subscription = new Subscription();
            subscription.setUser(user);
            subscription.setPlan(plan);
            subscription.setStartDate(LocalDateTime.now());
            subscription.setEndDate(LocalDateTime.now().plusMonths(1));
            subscription.setIsActive(true);

            subscriptionRepository.save(subscription);

            log.info(
                    "SUBSCRIPTION_SEED | Assinatura criada: Usuário: {} | Plano: {} | Data Início: {} | Data Fim: {}",
                    user.getEmail(),
                    plan.getName(),
                    subscription.getStartDate(),
                    subscription.getEndDate()
            );

            subscriptionIndex++;
        }
    }
}
