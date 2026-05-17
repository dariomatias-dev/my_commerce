import { PaginatedResponse } from "@/@types/paginated-response";
import { ProductFilters } from "@/@types/product/product-filters";
import { ProductResponse } from "@/@types/product/product-response";
import { internalApiClient } from "@/services/api-client";

export const getAllProducts = (filters: ProductFilters, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<ProductResponse>>("/api/products", {
    params: { ...filters, page, size },
  });

export const getProductsByIds = (storeId: string, productIds: string[], page = 0, size = 10) =>
  internalApiClient.post<PaginatedResponse<ProductResponse>>(
    "/api/products/by-ids",
    { storeId, productIds },
    { params: { page, size } },
  );

export const getProductBySlug = (storeSlug: string, productSlug: string) =>
  internalApiClient.get<ProductResponse>(`/api/products/store/${storeSlug}/product/${productSlug}`);

export const getProductById = (id: string) =>
  internalApiClient.get<ProductResponse>(`/api/products/${id}`);

export const getUserActiveProductsCount = () =>
  internalApiClient.get<number>("/api/products/stores/stats/active-products");

export const getActiveProductsCount = (storeId: string) =>
  internalApiClient.get<number>(`/api/products/store/${storeId}/stats/active-products`);
