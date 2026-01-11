"use client";

import { useCallback } from "react";

import { CategoryFilter } from "@/@types/category/category-filter";
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
    (filter?: CategoryFilter, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<CategoryResponse>>("/categories", {
        params: { ...filter, page, size },
      }),
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
    getCategoryById,
    updateCategory,
    deleteCategory,
  };
};
