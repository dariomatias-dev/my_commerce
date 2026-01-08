"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { ProductFilters } from "@/@types/product/product-filters";
import { ProductRequest } from "@/@types/product/product-request";
import { ProductResponse } from "@/@types/product/product-response";
import { apiClient } from "@/services/api-client";

export const useProduct = () => {
  const createProduct = useCallback((data: ProductRequest, images: File[]) => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    images.forEach((image) => {
      formData.append("images", image);
    });

    return apiClient.post<ProductResponse>("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }, []);

  const getProducts = useCallback(
    (url: string, filters: ProductFilters, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<ProductResponse>>(url, {
        params: {
          ...filters,
          page,
          size,
        },
      }),
    []
  );

  const getAllProducts = useCallback(
    (filters: ProductFilters, page = 0, size = 10) =>
      getProducts(`/products`, filters, page, size),
    [getProducts]
  );

  const getProductsByIds = useCallback(
    (storeId: string, productIds: string[], page = 0, size = 10) =>
      apiClient.post<PaginatedResponse<ProductResponse>>(
        `/products/store/products-by-ids`,
        { storeId, productIds },
        { params: { page, size } }
      ),
    []
  );

  const getProductBySlug = useCallback(
    (storeSlug: string, productSlug: string) =>
      apiClient.get<ProductResponse>(
        `/products/store/${storeSlug}/product/${productSlug}`
      ),
    []
  );

  const getProductById = useCallback(
    (id: string) => apiClient.get<ProductResponse>(`/products/${id}`),
    []
  );

  const getUserActiveProductsCount = useCallback(
    () => apiClient.get<number>(`/products/stores/stats/active-products`),
    []
  );

  const getActiveProductsCount = useCallback(
    (storeId: string) =>
      apiClient.get<number>(`/products/store/${storeId}/stats/active-products`),
    []
  );

  const updateProduct = useCallback(
    (id: string, data?: Partial<ProductRequest>, newImages?: File[]) => {
      const formData = new FormData();

      if (data) {
        formData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
      }

      newImages?.forEach((image) => {
        formData.append("images", image);
      });

      return apiClient.patch<ProductResponse>(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    []
  );

  const deleteProduct = useCallback(
    (id: string) => apiClient.delete<void>(`/products/${id}`),
    []
  );

  return {
    createProduct,
    getProducts,
    getAllProducts,
    getProductById,
    getProductBySlug,
    getProductsByIds,
    getUserActiveProductsCount,
    getActiveProductsCount,
    updateProduct,
    deleteProduct,
  };
};
