package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.model.Store;
import jakarta.persistence.criteria.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SuppressWarnings("unchecked")
@ExtendWith(MockitoExtension.class)
@DisplayName("StoreSpecification")
class StoreSpecificationTest {

    @Mock
    private Root<Store> root;

    @Mock
    private CriteriaQuery<?> criteriaQuery;

    @Mock
    private CriteriaBuilder cb;

    @Nested
    @DisplayName("user")
    class User {

        @Test
        @DisplayName("Returns equal predicate on user.id")
        void returnsEqualPredicateOnUserId() {
            UUID userId = UUID.randomUUID();
            Path<Object> userPath = mock(Path.class);
            Path<Object> userIdPath = mock(Path.class);
            Predicate predicate = mock(Predicate.class);

            when(root.get("user")).thenReturn(userPath);
            when(userPath.get("id")).thenReturn(userIdPath);
            when(cb.equal(userIdPath, userId)).thenReturn(predicate);

            Predicate result = StoreSpecification.user(userId).toPredicate(root, criteriaQuery, cb);

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

            Predicate result = StoreSpecification.active().toPredicate(root, criteriaQuery, cb);

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

            Predicate result = StoreSpecification.deleted().toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }
}
