package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.enums.Status;
import com.dariomatias.my_commerce.model.Order;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Page<Order> findAllByUser(User user, Pageable pageable);

    Page<Order> findAllByStore(Store store, Pageable pageable);

    @Query("""
        SELECT DISTINCT s
        FROM Order o
        JOIN o.store s
        WHERE o.user.id = :userId
    """)
    Page<Store> findStoresWithOrdersByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("""
        SELECT o
        FROM Order o
        WHERE o.user.id = :userId
          AND o.store.id = :storeId
    """)
    Page<Order> findAllByUserIdAndStoreId(
            @Param("userId") UUID userId,
            @Param("storeId") UUID storeId,
            Pageable pageable
    );

    long countByStore_IdAndStatus(UUID storeId, Status status);

    @Query("""
        SELECT COUNT(DISTINCT o.user.id)
        FROM Order o
        JOIN o.store s
        WHERE s.user.id = :userId
          AND o.status = :status
    """)
    long countDistinctCustomersByUserIdAndStatus(
            @Param("userId") UUID userId,
            @Param("status") Status status
    );

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        JOIN o.store s
        WHERE s.user.id = :userId
          AND o.status = :status
    """)
    BigDecimal sumTotalRevenueByUserIdAndStatus(
            @Param("userId") UUID userId,
            @Param("status") Status status
    );

    @Query("""
        SELECT COUNT(DISTINCT o.user.id)
        FROM Order o
        WHERE o.store.id = :storeId
          AND o.status = :status
    """)
    long countDistinctCustomersByStoreIdAndStatus(
            @Param("storeId") UUID storeId,
            @Param("status") Status status
    );

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.store.id = :storeId
          AND o.status = :status
    """)
    BigDecimal sumTotalRevenueByStoreIdAndStatus(
            @Param("storeId") UUID storeId,
            @Param("status") Status status
    );

    @Query("""
        SELECT o
        FROM Order o
        LEFT JOIN FETCH o.items
        WHERE o.id = :id
    """)
    Optional<Order> getByIdWithItems(@Param("id") UUID id);
}
