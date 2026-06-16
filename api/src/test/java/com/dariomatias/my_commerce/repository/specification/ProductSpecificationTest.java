package com.dariomatias.my_commerce.repository.specification;

import com.dariomatias.my_commerce.enums.StatusFilter;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Product;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.model.User;
import com.dariomatias.my_commerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest(properties = {
        "spring.liquibase.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@DisplayName("ProductSpecification")
class ProductSpecificationTest {

    @Autowired
    private TestEntityManager em;

    @Autowired
    private ProductRepository repository;

    private Store store;
    private Category category;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("hashed");
        em.persist(user);

        store = new Store();
        store.setName("Test Store");
        store.setSlug("test-store");
        store.setDescription("desc");
        store.setThemeColor("#000000");
        store.setUser(user);
        em.persist(store);

        category = new Category();
        category.setName("Test Category");
        category.setStore(store);
        em.persist(category);

        em.flush();
    }

    private Product buildProduct(String name, BigDecimal price, int stock) {
        Product p = new Product();
        p.setName(name);
        p.setSlug(name.toLowerCase().replace(" ", "-"));
        p.setDescription("test description");
        p.setPrice(price);
        p.setStock(stock);
        p.setStore(store);
        p.setCategory(category);
        return p;
    }

    @Nested
    @DisplayName("store")
    class StoreSpec {

        @Test
        @DisplayName("Returns only products from the given store")
        void returnsProductsForGivenStore() {
            User user2 = new User();
            user2.setName("Other User");
            user2.setEmail("other@example.com");
            user2.setPassword("hashed");
            em.persist(user2);

            Store store2 = new Store();
            store2.setName("Other Store");
            store2.setSlug("other-store");
            store2.setDescription("desc");
            store2.setThemeColor("#ffffff");
            store2.setUser(user2);
            em.persist(store2);

            Category category2 = new Category();
            category2.setName("Other Category");
            category2.setStore(store2);
            em.persist(category2);

            Product p1 = buildProduct("In Store 1", BigDecimal.TEN, 10);
            Product p2 = buildProduct("In Store 2", BigDecimal.TEN, 10);
            p2.setStore(store2);
            p2.setCategory(category2);
            em.persist(p1);
            em.persist(p2);
            em.flush();

            List<Product> result = repository.findAll(ProductSpecification.store(store.getId()));

            assertEquals(1, result.size());
            assertEquals("In Store 1", result.get(0).getName());
        }
    }

    @Nested
    @DisplayName("category")
    class CategorySpec {

        @Test
        @DisplayName("Returns only products from the given category")
        void returnsProductsForGivenCategory() {
            Category category2 = new Category();
            category2.setName("Other Category");
            category2.setStore(store);
            em.persist(category2);

            Product p1 = buildProduct("In Category 1", BigDecimal.TEN, 10);
            Product p2 = buildProduct("In Category 2", BigDecimal.TEN, 10);
            p2.setCategory(category2);
            em.persist(p1);
            em.persist(p2);
            em.flush();

            List<Product> result = repository.findAll(ProductSpecification.category(category.getId()));

            assertEquals(1, result.size());
            assertEquals("In Category 1", result.get(0).getName());
        }
    }

    @Nested
    @DisplayName("name")
    class NameSpec {

        @Test
        @DisplayName("Returns products matching case-insensitive LIKE")
        void returnsMatchingProductsCaseInsensitive() {
            em.persist(buildProduct("iPhone 15 Pro", BigDecimal.TEN, 10));
            em.persist(buildProduct("Samsung Galaxy", BigDecimal.TEN, 10));
            em.flush();

            List<Product> result = repository.findAll(ProductSpecification.name("IPHONE"));

            assertEquals(1, result.size());
            assertEquals("iPhone 15 Pro", result.get(0).getName());
        }

        @Test
        @DisplayName("Matches partial name substring")
        void matchesPartialSubstring() {
            em.persist(buildProduct("iPhone 15 Pro", BigDecimal.TEN, 10));
            em.persist(buildProduct("Samsung Galaxy", BigDecimal.TEN, 10));
            em.flush();

            List<Product> result = repository.findAll(ProductSpecification.name("galaxy"));

            assertEquals(1, result.size());
            assertEquals("Samsung Galaxy", result.get(0).getName());
        }
    }

    @Nested
    @DisplayName("minPrice")
    class MinPriceSpec {

        @Test
        @DisplayName("Returns only products with price >= minPrice")
        void returnsProductsAboveOrEqualMinPrice() {
            em.persist(buildProduct("Cheap", new BigDecimal("10.00"), 5));
            em.persist(buildProduct("Expensive", new BigDecimal("200.00"), 5));
            em.flush();

            List<Product> result = repository.findAll(ProductSpecification.minPrice(new BigDecimal("50.00")));

            assertEquals(1, result.size());
            assertEquals("Expensive", result.get(0).getName());
        }
    }

    @Nested
    @DisplayName("maxPrice")
    class MaxPriceSpec {

        @Test
        @DisplayName("Returns only products with price <= maxPrice")
        void returnsProductsBelowOrEqualMaxPrice() {
            em.persist(buildProduct("Cheap", new BigDecimal("10.00"), 5));
            em.persist(buildProduct("Expensive", new BigDecimal("200.00"), 5));
            em.flush();

            List<Product> result = repository.findAll(ProductSpecification.maxPrice(new BigDecimal("50.00")));

            assertEquals(1, result.size());
            assertEquals("Cheap", result.get(0).getName());
        }
    }

    @Nested
    @DisplayName("lowStock")
    class LowStockSpec {

        @Test
        @DisplayName("Returns only products with stock <= threshold")
        void returnsProductsBelowOrEqualThreshold() {
            em.persist(buildProduct("Low Stock", BigDecimal.TEN, 3));
            em.persist(buildProduct("High Stock", BigDecimal.TEN, 100));
            em.flush();

            List<Product> result = repository.findAll(ProductSpecification.lowStock(10));

            assertEquals(1, result.size());
            assertEquals("Low Stock", result.get(0).getName());
        }
    }

    @Nested
    @DisplayName("status")
    class StatusSpec {

        private Product activeProduct;
        private Product deletedProduct;
        private Product inactiveProduct;

        @BeforeEach
        void setUp() {
            activeProduct = buildProduct("Active Product", BigDecimal.TEN, 10);
            activeProduct.setActive(true);
            activeProduct.setDeletedAt(null);

            deletedProduct = buildProduct("Deleted Product", BigDecimal.TEN, 10);
            deletedProduct.setActive(false);
            deletedProduct.setDeletedAt(LocalDateTime.now());

            inactiveProduct = buildProduct("Inactive Product", BigDecimal.TEN, 10);
            inactiveProduct.setActive(false);
            inactiveProduct.setDeletedAt(null);

            em.persist(activeProduct);
            em.persist(deletedProduct);
            em.persist(inactiveProduct);
            em.flush();
        }

        @Test
        @DisplayName("ACTIVE — returns only active=true AND deletedAt=null products")
        void activeReturnsOnlyFullyActiveProducts() {
            List<Product> result = repository.findAll(ProductSpecification.status(StatusFilter.ACTIVE));

            assertEquals(1, result.size());
            assertEquals("Active Product", result.get(0).getName());
        }

        @Test
        @DisplayName("ACTIVE — excludes product with active=false even when deletedAt=null")
        void activeExcludesInactiveWithNullDeletedAt() {
            List<Product> result = repository.findAll(ProductSpecification.status(StatusFilter.ACTIVE));

            assertTrue(result.stream().noneMatch(p -> p.getName().equals("Inactive Product")));
        }

        @Test
        @DisplayName("DELETED — returns only products with deletedAt IS NOT NULL")
        void deletedReturnsOnlyProductsWithDeletedAt() {
            List<Product> result = repository.findAll(ProductSpecification.status(StatusFilter.DELETED));

            assertEquals(1, result.size());
            assertEquals("Deleted Product", result.get(0).getName());
        }

        @Test
        @DisplayName("ALL — returns all products regardless of status")
        void allReturnsEveryProduct() {
            List<Product> result = repository.findAll(ProductSpecification.status(StatusFilter.ALL));

            assertEquals(3, result.size());
        }
    }
}
