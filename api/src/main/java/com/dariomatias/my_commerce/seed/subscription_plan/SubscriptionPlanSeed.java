package com.dariomatias.my_commerce.seed.subscription_plan;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.SubscriptionPlanRepository;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Component
public class SubscriptionPlanSeed {

    private final SubscriptionPlanRepository repository;

    public SubscriptionPlanSeed(SubscriptionPlanRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void createPlans() {
        SubscriptionPlan starter = new SubscriptionPlan();
        starter.setName("Starter");
        starter.setMaxStores(1);
        starter.setMaxProducts(20);
        starter.setFeatures("Layout simples, Estatísticas básicas");
        starter.setPrice(BigDecimal.valueOf(0));

        SubscriptionPlan pro = new SubscriptionPlan();
        pro.setName("Pro");
        pro.setMaxStores(3);
        pro.setMaxProducts(Integer.MAX_VALUE);
        pro.setFeatures("Layouts personalizados, Estatísticas avançadas, Suporte básico");
        pro.setPrice(BigDecimal.valueOf(29.99));

        SubscriptionPlan business = new SubscriptionPlan();
        business.setName("Business");
        business.setMaxStores(Integer.MAX_VALUE);
        business.setMaxProducts(Integer.MAX_VALUE);
        business.setFeatures("Personalização completa, Relatórios detalhados e exportáveis, Recursos extras (cupons, promoções, avaliações), Suporte prioritário");
        business.setPrice(BigDecimal.valueOf(99.99));

        List<SubscriptionPlan> plans = List.of(starter, pro, business);

        for (SubscriptionPlan plan : plans) {
            if (!repository.existsByName(plan.getName())) {
                repository.save(plan);
            }
        }
    }
}
