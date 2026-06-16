package com.dariomatias.my_commerce.controller;

import com.dariomatias.my_commerce.annotation.ControllerTest;
import com.dariomatias.my_commerce.dto.category.CategoryFilterDTO;
import com.dariomatias.my_commerce.dto.category.CategoryRequestDTO;
import com.dariomatias.my_commerce.model.Category;
import com.dariomatias.my_commerce.model.shared.AuditMetadata;
import com.dariomatias.my_commerce.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ControllerTest(CategoryController.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CategoryService service;

    private UUID categoryId;
    private UUID storeId;
    private Category category;
    private CategoryRequestDTO request;

    @BeforeEach
    void setUp() {
        categoryId = UUID.randomUUID();
        storeId = UUID.randomUUID();

        AuditMetadata audit = new AuditMetadata();
        audit.setCreatedAt(LocalDateTime.now());
        audit.setUpdatedAt(LocalDateTime.now());

        category = new Category();
        category.setId(categoryId);
        category.setName("Electronics");
        category.setStoreId(storeId);
        category.setAudit(audit);

        request = new CategoryRequestDTO();
        request.setStoreId(storeId);
        request.setName("Electronics");
    }

    @Nested
    @DisplayName("POST /api/categories")
    class Create {

        @Test
        @DisplayName("should create category")
        void shouldCreateCategory() throws Exception {
            when(service.create(any(CategoryRequestDTO.class))).thenReturn(category);

            mockMvc.perform(post("/api/categories")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("Electronics"))
                    .andExpect(jsonPath("$.data.storeId").value(storeId.toString()));

            verify(service).create(any(CategoryRequestDTO.class));
        }

        @Test
        @DisplayName("should return 400 when request is invalid")
        void shouldReturn400WhenCreateRequestInvalid() throws Exception {
            mockMvc.perform(post("/api/categories")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("GET /api/categories")
    class GetAll {

        @Test
        @DisplayName("should return category page with query params")
        void shouldReturnCategoryPage() throws Exception {
            Page<Category> page = new PageImpl<>(List.of(category));
            when(service.getAll(any(CategoryFilterDTO.class), any(Pageable.class))).thenReturn(page);

            mockMvc.perform(get("/api/categories")
                            .param("storeId", storeId.toString())
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.content[0].name").value("Electronics"))
                    .andExpect(jsonPath("$.data.totalElements").value(1));

            verify(service).getAll(any(CategoryFilterDTO.class), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("GET /api/categories/{id}")
    class GetById {

        @Test
        @DisplayName("should return category by ID")
        void shouldReturnCategoryById() throws Exception {
            when(service.getById(categoryId)).thenReturn(category);

            mockMvc.perform(get("/api/categories/{id}", categoryId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.id").value(categoryId.toString()))
                    .andExpect(jsonPath("$.data.name").value("Electronics"));

            verify(service).getById(categoryId);
        }
    }

    @Nested
    @DisplayName("PATCH /api/categories/{id}")
    class Update {

        @Test
        @DisplayName("should update category")
        void shouldUpdateCategory() throws Exception {
            CategoryRequestDTO updateRequest = new CategoryRequestDTO();
            updateRequest.setStoreId(storeId);
            updateRequest.setName("Updated Electronics");

            category.setName("Updated Electronics");
            when(service.update(eq(categoryId), any(CategoryRequestDTO.class))).thenReturn(category);

            mockMvc.perform(patch("/api/categories/{id}", categoryId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.data.name").value("Updated Electronics"));

            verify(service).update(eq(categoryId), any(CategoryRequestDTO.class));
        }

        @Test
        @DisplayName("should return 400 when request is invalid")
        void shouldReturn400WhenUpdateRequestInvalid() throws Exception {
            mockMvc.perform(patch("/api/categories/{id}", categoryId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("DELETE /api/categories/{id}")
    class Delete {

        @Test
        @DisplayName("should delete category by ID")
        void shouldDeleteCategory() throws Exception {
            doNothing().when(service).delete(categoryId);

            mockMvc.perform(delete("/api/categories/{id}", categoryId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("success"))
                    .andExpect(jsonPath("$.message").value("Category deleted successfully."));

            verify(service).delete(categoryId);
        }
    }
}
