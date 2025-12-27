package com.dariomatias.my_commerce.repository.jpa;

import com.dariomatias.my_commerce.model.ProductImage;
import com.dariomatias.my_commerce.repository.ProductImageRepository;
import com.dariomatias.my_commerce.repository.contract.ProductImageContract;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@ConditionalOnProperty(
        name = "app.persistence",
        havingValue = "jpa",
        matchIfMissing = true
)
public class ProductImageJpaRepository implements ProductImageContract {

    private final ProductImageRepository repository;

    public ProductImageJpaRepository(ProductImageRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ProductImage> findAllByProduct(UUID productId) {
        return repository.findAllByProduct_IdOrderByPositionAsc(productId);
    }

    @Override
    public void deleteAllByProduct(UUID productId) {
        repository.deleteAllByProduct_Id(productId);
    }

    @Override
    public ProductImage save(ProductImage image) {
        return repository.save(image);
    }

    @Override
    public void delete(ProductImage image) {
        repository.delete(image);
    }
}
