package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.dto.audit_log.AuditLogFilterDTO;
import com.dariomatias.my_commerce.enums.AuditLogAction;
import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AuditLogSpecification")
class AuditLogSpecificationTest {

    private AuditLogFilterDTO filters;

    @BeforeEach
    void setUp() {
        filters = new AuditLogFilterDTO();
    }

    @Nested
    @DisplayName("build")
    class Build {

        @Nested
        @DisplayName("date defaults")
        class DateDefaults {

            @Test
            @DisplayName("null startDate — uses epoch (1970-01-01T00:00)")
            void nullStartDateUsesEpoch() {
                Query query = AuditLogSpecification.build(filters);

                Document timestamp = (Document) query.getQueryObject().get("timestamp");
                assertEquals(LocalDateTime.of(1970, 1, 1, 0, 0), timestamp.get("$gte"));
            }

            @Test
            @DisplayName("null endDate — uses max (9999-12-31T23:59)")
            void nullEndDateUsesMaxDate() {
                Query query = AuditLogSpecification.build(filters);

                Document timestamp = (Document) query.getQueryObject().get("timestamp");
                assertEquals(LocalDateTime.of(9999, 12, 31, 23, 59), timestamp.get("$lte"));
            }

            @Test
            @DisplayName("provided startDate — used instead of default")
            void providedStartDateOverridesDefault() {
                LocalDateTime startDate = LocalDateTime.of(2024, 6, 1, 8, 0);
                filters.setStartDate(startDate);

                Query query = AuditLogSpecification.build(filters);

                Document timestamp = (Document) query.getQueryObject().get("timestamp");
                assertEquals(startDate, timestamp.get("$gte"));
            }

            @Test
            @DisplayName("provided endDate — used instead of default")
            void providedEndDateOverridesDefault() {
                LocalDateTime endDate = LocalDateTime.of(2024, 12, 31, 23, 59);
                filters.setEndDate(endDate);

                Query query = AuditLogSpecification.build(filters);

                Document timestamp = (Document) query.getQueryObject().get("timestamp");
                assertEquals(endDate, timestamp.get("$lte"));
            }
        }

        @Nested
        @DisplayName("userId filter")
        class UserId {

            @Test
            @DisplayName("null — not added to query")
            void nullNotAddedToQuery() {
                Query query = AuditLogSpecification.build(filters);

                assertFalse(query.getQueryObject().containsKey("userId"));
            }

            @Test
            @DisplayName("empty string — not added to query")
            void emptyStringNotAddedToQuery() {
                filters.setUserId("");

                Query query = AuditLogSpecification.build(filters);

                assertFalse(query.getQueryObject().containsKey("userId"));
            }

            @Test
            @DisplayName("non-empty — added to query")
            void nonEmptyAddedToQuery() {
                filters.setUserId("user-123");

                Query query = AuditLogSpecification.build(filters);

                assertEquals("user-123", query.getQueryObject().get("userId"));
            }
        }

        @Nested
        @DisplayName("action filter")
        class Action {

            @Test
            @DisplayName("null — not added to query")
            void nullNotAddedToQuery() {
                Query query = AuditLogSpecification.build(filters);

                assertFalse(query.getQueryObject().containsKey("action"));
            }

            @Test
            @DisplayName("empty string — not added to query")
            void emptyStringNotAddedToQuery() {
                filters.setAction("");

                Query query = AuditLogSpecification.build(filters);

                assertFalse(query.getQueryObject().containsKey("action"));
            }

            @Test
            @DisplayName("valid lowercase string — mapped to enum")
            void validStringMappedToEnum() {
                filters.setAction("login");

                Query query = AuditLogSpecification.build(filters);

                assertEquals(AuditLogAction.LOGIN, query.getQueryObject().get("action"));
            }

            @Test
            @DisplayName("valid uppercase string — case-insensitive mapping")
            void validUppercaseStringMappedCaseInsensitively() {
                filters.setAction("SIGNUP");

                Query query = AuditLogSpecification.build(filters);

                assertEquals(AuditLogAction.SIGNUP, query.getQueryObject().get("action"));
            }

            @Test
            @DisplayName("invalid string — throws IllegalArgumentException")
            void invalidStringThrows() {
                filters.setAction("invalid_action");

                assertThrows(IllegalArgumentException.class, () -> AuditLogSpecification.build(filters));
            }
        }

        @Test
        @DisplayName("sort — descending by timestamp")
        void sortDescendingByTimestamp() {
            Query query = AuditLogSpecification.build(filters);

            Document sortDoc = query.getSortObject();
            assertEquals(-1, sortDoc.get("timestamp"));
        }
    }
}
