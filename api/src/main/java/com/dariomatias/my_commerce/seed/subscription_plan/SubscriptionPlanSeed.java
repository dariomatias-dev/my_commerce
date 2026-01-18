package com.dariomatias.my_commerce.seed.subscription_plan;

import com.dariomatias.my_commerce.model.SubscriptionPlan;
import com.dariomatias.my_commerce.repository.SubscriptionPlanRepository;
import com.dariomatias.my_commerce.seed.Seed;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class SubscriptionPlanSeed implements Seed {

    private final SubscriptionPlanRepository repository;

    public SubscriptionPlanSeed(SubscriptionPlanRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public void run() {
        createPlans();
    }

    public void createPlans() {
        SubscriptionPlan starter = new SubscriptionPlan();
        starter.setName("Starter");
        starter.setMaxStores(1);
        starter.setMaxProducts(20);
        starter.setFeatures(
                "Gestão de 1 Loja; " +
                "Criação de 20 Produtos; " +
                "Gestão de pedidos; " +
                "Relatórios básicos; " +
                "Suporte básico"
        );
        starter.setPrice(BigDecimal.valueOf(0));

        SubscriptionPlan pro = new SubscriptionPlan();
        pro.setName("Pro");
        pro.setMaxStores(3);
        pro.setMaxProducts(Integer.MAX_VALUE);
        pro.setFeatures(
                "Gestão de 3 Lojas; " +
                "Criação Imitada de Produtos; " +
                "Relatórios avançados; " +
                "Cupons de desconto; " +
                "Suporte avançado; " +
                "Os mesmos do anterior"
        );
        pro.setPrice(BigDecimal.valueOf(29.99));

        SubscriptionPlan business = new SubscriptionPlan();
        business.setName("Business");
        business.setMaxStores(Integer.MAX_VALUE);
        business.setMaxProducts(Integer.MAX_VALUE);
        business.setFeatures(
                "Criação Ilimitada de Lojas; " +
                "Criação Imitada de Produtos; " +
                "Múltiplos administradores; " +
                "Exportação de relatórios; " +
                "Integração com meios de pagamento; " +
                "Prioridade em recursos novos; " +
                "Suporte 24h por semana; " +
                "Os mesmos do anterior"
        );
        business.setPrice(BigDecimal.valueOf(99.99));

        List<SubscriptionPlan> plans = List.of(starter, pro, business);

        for (SubscriptionPlan plan : plans) {
            if (!repository.existsByName(plan.getName())) {
                repository.save(plan);
            }
        }
    }
}
