package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.enums.UserRole;
import com.dariomatias.my_commerce.model.User;
import jakarta.persistence.criteria.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SuppressWarnings("unchecked")
@ExtendWith(MockitoExtension.class)
@DisplayName("UserSpecification")
class UserSpecificationTest {

    @Mock
    private Root<User> root;

    @Mock
    private CriteriaQuery<?> criteriaQuery;

    @Mock
    private CriteriaBuilder cb;

    @Nested
    @DisplayName("name")
    class Name {

        @Test
        @DisplayName("Returns case-insensitive LIKE with % wrapping")
        void returnsCaseInsensitiveLikeWithWrapping() {
            Path<String> namePath = mock(Path.class);
            Expression<String> lowerExpr = mock(Expression.class);
            Predicate predicate = mock(Predicate.class);

            when(root.<String>get("name")).thenReturn(namePath);
            when(cb.lower(namePath)).thenReturn(lowerExpr);
            when(cb.like(lowerExpr, "%john%")).thenReturn(predicate);

            Predicate result = UserSpecification.name("John").toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }

    @Nested
    @DisplayName("email")
    class Email {

        @Test
        @DisplayName("Returns case-insensitive LIKE with % wrapping")
        void returnsCaseInsensitiveLikeWithWrapping() {
            Path<String> emailPath = mock(Path.class);
            Expression<String> lowerExpr = mock(Expression.class);
            Predicate predicate = mock(Predicate.class);

            when(root.<String>get("email")).thenReturn(emailPath);
            when(cb.lower(emailPath)).thenReturn(lowerExpr);
            when(cb.like(lowerExpr, "%john@example.com%")).thenReturn(predicate);

            Predicate result = UserSpecification.email("John@Example.com").toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }

    @Nested
    @DisplayName("role")
    class Role {

        @Test
        @DisplayName("Returns equal predicate on role")
        void returnsEqualPredicateOnRole() {
            Path<UserRole> rolePath = mock(Path.class);
            Predicate predicate = mock(Predicate.class);

            when(root.<UserRole>get("role")).thenReturn(rolePath);
            when(cb.equal(rolePath, UserRole.ADMIN)).thenReturn(predicate);

            Predicate result = UserSpecification.role(UserRole.ADMIN).toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }

    @Nested
    @DisplayName("active")
    class Active {

        @Test
        @DisplayName("Returns isNull predicate on deletedAt")
        void returnsIsNullOnDeletedAt() {
            Path<Object> deletedAtPath = mock(Path.class);
            Predicate predicate = mock(Predicate.class);

            when(root.get("deletedAt")).thenReturn(deletedAtPath);
            when(cb.isNull(deletedAtPath)).thenReturn(predicate);

            Predicate result = UserSpecification.active().toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }

    @Nested
    @DisplayName("deleted")
    class Deleted {

        @Test
        @DisplayName("Returns isNotNull predicate on deletedAt")
        void returnsIsNotNullOnDeletedAt() {
            Path<Object> deletedAtPath = mock(Path.class);
            Predicate predicate = mock(Predicate.class);

            when(root.get("deletedAt")).thenReturn(deletedAtPath);
            when(cb.isNotNull(deletedAtPath)).thenReturn(predicate);

            Predicate result = UserSpecification.deleted().toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }
}
