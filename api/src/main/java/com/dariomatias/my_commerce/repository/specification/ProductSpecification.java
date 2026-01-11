package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.enums.StatusFilter;
import com.dariomatias.my_commerce.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
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

    public static Specification<Product> name(String name) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Product> minPrice(BigDecimal minPrice) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Product> maxPrice(BigDecimal maxPrice) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Product> lowStock(Integer threshold) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("stock"), threshold);
    }

    public static Specification<Product> status(StatusFilter status) {
        return (root, query, cb) -> {
            switch (status) {
                case ACTIVE:
                    return cb.and(
                            cb.isTrue(root.get("active")),
                            cb.isNull(root.get("deletedAt"))
                    );
                case DELETED:
                    return cb.isNotNull(root.get("deletedAt"));
                default:
                    return cb.conjunction();
            }
        };
    }

    public ProductSpecification() {}
}
