package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecification {

    public static Specification<User> name(String name) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<User> email(String email) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<User> role(UserRole role) {
        return (root, query, cb) -> cb.equal(root.get("role"), role);
    }

    public static Specification<User> active() {
        return (root, query, cb) -> cb.isNull(root.get("deletedAt"));
    }

    public static Specification<User> deleted() {
        return (root, query, cb) -> cb.isNotNull(root.get("deletedAt"));
    }

    private UserSpecification() {}
}
