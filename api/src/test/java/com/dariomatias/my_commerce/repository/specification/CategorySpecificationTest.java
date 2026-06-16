package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.model.Category;
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
@DisplayName("CategorySpecification")
class CategorySpecificationTest {

    @Mock
    private Root<Category> root;

    @Mock
    private CriteriaQuery<?> criteriaQuery;

    @Mock
    private CriteriaBuilder cb;

    @Nested
    @DisplayName("store")
    class Store {

        @Test
        @DisplayName("Returns equal predicate on store.id")
        void returnsEqualPredicateOnStoreId() {
            UUID storeId = UUID.randomUUID();
            Path<Object> storePath = mock(Path.class);
            Path<Object> storeIdPath = mock(Path.class);
            Predicate predicate = mock(Predicate.class);

            when(root.get("store")).thenReturn(storePath);
            when(storePath.get("id")).thenReturn(storeIdPath);
            when(cb.equal(storeIdPath, storeId)).thenReturn(predicate);

            Predicate result = CategorySpecification.store(storeId).toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }

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
            when(cb.like(lowerExpr, "%electronics%")).thenReturn(predicate);

            Predicate result = CategorySpecification.name("Electronics").toPredicate(root, criteriaQuery, cb);

            assertEquals(predicate, result);
        }
    }
}
