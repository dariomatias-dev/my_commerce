"use client";

import { useCallback } from "react";

import { CategoryRequest } from "@/@types/category/category-request";
import { CategoryResponse } from "@/@types/category/category-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { apiClient } from "@/services/api-client";

export const useCategory = () => {
  const createCategory = useCallback(
    (data: CategoryRequest) =>
      apiClient.post<CategoryResponse>("/categories", data),
    []
  );

  const getAllCategories = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<CategoryResponse>>("/categories", {
        params: { page, size },
      }),
    []
  );

  const getCategoriesByStoreId = useCallback(
    (storeId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<CategoryResponse>>(
        `/categories/store/${storeId}`,
        { params: { page, size } }
      ),
    []
  );

  const getCategoryById = useCallback(
    (id: string) => apiClient.get<CategoryResponse>(`/categories/${id}`),
    []
  );

  const updateCategory = useCallback(
    (id: string, data: Partial<CategoryRequest>) =>
      apiClient.patch<CategoryResponse>(`/categories/${id}`, data),
    []
  );

  const deleteCategory = useCallback(
    (id: string) => apiClient.delete<void>(`/categories/${id}`),
    []
  );

  return {
    createCategory,
    getAllCategories,
    getCategoriesByStoreId,
    getCategoryById,
    updateCategory,
    deleteCategory,
  };
};
