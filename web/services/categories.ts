import { CategoryFilter } from "@/@types/category/category-filter";
import { CategoryResponse } from "@/@types/category/category-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { internalApiClient } from "@/services/api-client";

export const getAllCategories = (filter?: CategoryFilter, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<CategoryResponse>>("/api/categories", {
    params: { ...filter, page, size },
  });

export const getCategoryById = (id: string) =>
  internalApiClient.get<CategoryResponse>(`/api/categories/${id}`);
