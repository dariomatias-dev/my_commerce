package com.dariomatias.my_commerce.service;

import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.Store;
import com.dariomatias.my_commerce.repository.contract.CategoryContract;
import com.dariomatias.my_commerce.repository.contract.StoreContract;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryService")
class CategoryServiceTest {

    @Mock
    private CategoryContract categoryRepository;

    @Mock
    private StoreContract storeRepository;

    @InjectMocks
    private CategoryService categoryService;

    private UUID storeId;
    private UUID categoryId;
    private Store store;
    private Category category;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        storeId = UUID.randomUUID();
        categoryId = UUID.randomUUID();

        store = new Store();
        store.setId(storeId);

        category = new Category();
        category.setId(categoryId);
        category.setStore(store);
        category.setName("Eletrônicos");

        pageable = PageRequest.of(0, 10);
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("loja não encontrada deve lançar 404")
        void lojaNaoEncontrada_deveLancar404() {
            CategoryRequestDTO request = new CategoryRequestDTO();
            request.setStoreId(storeId);
            request.setName("Eletrônicos");

            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> categoryService.create(request));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verifyNoInteractions(categoryRepository);
        }

        @Test
        @DisplayName("loja encontrada deve criar e retornar categoria")
        void lojaEncontrada_deveCriarCategoria() {
            CategoryRequestDTO request = new CategoryRequestDTO();
            request.setStoreId(storeId);
            request.setName("Eletrônicos");

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(categoryRepository.save(any(Category.class))).thenReturn(category);

            Category result = categoryService.create(request);

            assertNotNull(result);
            assertEquals("Eletrônicos", result.getName());
            verify(categoryRepository).save(any(Category.class));
        }
    }

    @Nested
    @DisplayName("getAll")
    class GetAll {

        @Test
        @DisplayName("filtro null deve lançar 400")
        void filtroNull_deveLancar400() {
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> categoryService.getAll(null, pageable));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
            verifyNoInteractions(storeRepository, categoryRepository);
        }

        @Test
        @DisplayName("loja não encontrada deve lançar 404")
        void lojaNaoEncontrada_deveLancar404() {
            CategoryFilterDTO filter = new CategoryFilterDTO();
            filter.setStoreId(storeId);

            when(storeRepository.findById(storeId)).thenReturn(Optional.empty());

            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> categoryService.getAll(filter, pageable));

            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
            verifyNoInteractions(categoryRepository);
        }

        @Test
        @DisplayName("filtro válido deve retornar página de categorias")
        void filtroValido_deveRetornarPagina() {
            CategoryFilterDTO filter = new CategoryFilterDTO();
            filter.setStoreId(storeId);
            Page<Category> page = new PageImpl<>(List.of(category));

            when(storeRepository.findById(storeId)).thenReturn(Optional.of(store));
            when(categoryRepository.findAll(filter, pageable)).thenReturn(page);

            Page<Category> result = categoryService.getAll(filter, pageable);

            assertEquals(1, result.getTotalElements());
            assertEquals("Eletrônicos", result.getContent().get(0).getName());
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("name null não deve alterar o nome da categoria")
        void nameNull_naoDeveAlterarNome() {
            CategoryRequestDTO request = new CategoryRequestDTO();
            request.setStoreId(storeId);
            request.setName(null);

            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
            when(categoryRepository.update(category)).thenReturn(category);

            Category result = categoryService.update(categoryId, request);

            assertEquals("Eletrônicos", result.getName());
            verify(categoryRepository).update(category);
        }

        @Test
        @DisplayName("name preenchido deve alterar o nome da categoria")
        void namePreenchido_deveAlterarNome() {
            CategoryRequestDTO request = new CategoryRequestDTO();
            request.setStoreId(storeId);
            request.setName("Games");

            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
            when(categoryRepository.update(category)).thenReturn(category);

            Category result = categoryService.update(categoryId, request);

            assertEquals("Games", result.getName());
            verify(categoryRepository).update(category);
        }
    }
}
