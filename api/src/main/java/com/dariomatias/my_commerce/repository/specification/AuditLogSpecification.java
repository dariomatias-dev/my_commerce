package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.dto.audit_log.AuditLogFilterDTO;
import com.dariomatias.my_commerce.enums.AuditLogAction;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;

public final class AuditLogSpecification {

    public static Query build(AuditLogFilterDTO filters) {
        Criteria criteria = new Criteria();

        if (filters.getUserId() != null && !filters.getUserId().isEmpty()) {
            criteria = criteria.and("userId").is(filters.getUserId());
        }

        if (filters.getAction() != null && !filters.getAction().isEmpty()) {
            AuditLogAction action = AuditLogAction.fromValue(filters.getAction());
            criteria = criteria.and("action").is(action);
        }

        LocalDateTime startDate = filters.getStartDate() != null
                ? filters.getStartDate()
                : LocalDateTime.of(1970, 1, 1, 0, 0);

        LocalDateTime endDate = filters.getEndDate() != null
                ? filters.getEndDate()
                : LocalDateTime.of(9999, 12, 31, 23, 59);

        criteria = criteria.and("timestamp").gte(startDate).lte(endDate);

        Query query = new Query(criteria);
        query.with(Sort.by(Sort.Direction.DESC, "timestamp"));

        return query;
    }

    private AuditLogSpecification() {}
}
