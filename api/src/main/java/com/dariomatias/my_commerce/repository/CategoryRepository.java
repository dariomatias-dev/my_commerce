package com.dariomatias.my_commerce.repository;

import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID>, JpaSpecificationExecutor<Category> {

    List<Category> findAllByStore(Store store);

    boolean existsByStoreAndName(Store store, String name);
}
