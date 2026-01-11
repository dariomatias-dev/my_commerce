package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.model.Category;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public final class CategorySpecification {

    public static Specification<Category> store(UUID storeId) {
        return (root, query, cb) ->
                cb.equal(root.get("store").get("id"), storeId);
    }

    public static Specification<Category> name(String name) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private CategorySpecification() {}
}
