package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public final class ProductSpecification {

    public static Specification<Product> store(UUID storeId) {
        return (root, query, cb) ->
                cb.equal(root.get("store").get("id"), storeId);
    }

    public static Specification<Product> category(UUID categoryId) {
        return (root, query, cb) ->
                cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> lowStock(Integer threshold) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("stock"), threshold);
    }

    public static Specification<Product> active() {
        return (root, query, cb) ->
                cb.isNull(root.get("deletedAt"));
    }

    public static Specification<Product> deleted() {
        return (root, query, cb) ->
                cb.isNotNull(root.get("deletedAt"));
    }

    public ProductSpecification() {}
}
