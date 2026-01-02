package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.model.Store;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public final class StoreSpecification {

    public static Specification<Store> user(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Store> active() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }

    public static Specification<Store> deleted() {
        return (root, query, cb) -> cb.isNotNull(root.get("deletedAt"));
    }
}
