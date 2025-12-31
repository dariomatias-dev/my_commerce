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
    (url: string, filters: ProductFilters = {}, page = 0, size = 10) =>
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
    (filters: ProductFilters = {}, page = 0, size = 10) =>
      getProducts("/products", filters, page, size),
    [getProducts]
  );

  const getProductsByStoreId = useCallback(
    (storeId: string, filters: ProductFilters = {}, page = 0, size = 10) =>
      getProducts(`/products/store/${storeId}`, filters, page, size),
    [getProducts]
  );

  const getProductBySlug = useCallback(
    (storeSlug: string, productSlug: string) =>
      apiClient.get<ProductResponse>(
        `/products/store/${storeSlug}/product/${productSlug}`
      ),
    []
  );

  const getLowStockProductsByStore = useCallback(
    (storeSlug: string, threshold = 10, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<ProductResponse>>(
        `/products/store/${storeSlug}/low-stock`,
        { params: { threshold, page, size } }
      ),
    []
  );

  const getProductById = useCallback(
    (id: string) => apiClient.get<ProductResponse>(`/products/${id}`),
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
    getProductsByStoreId,
    getProductById,
    getProductBySlug,
    getLowStockProductsByStore,
    updateProduct,
    deleteProduct,
  };
};
