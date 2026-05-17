import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreFilter } from "@/@types/store/store-filter";
import { StoreResponse } from "@/@types/store/store-response";
import { internalApiClient } from "@/services/api-client";

export const getAllByUser = (filters: StoreFilter, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<StoreResponse>>("/api/stores", {
    params: { ...filters, page, size },
  });

export const getMyStores = (page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<StoreResponse>>("/api/stores/me", {
    params: { page, size },
  });

export const getStoreById = (id: string) =>
  internalApiClient.get<StoreResponse>(`/api/stores/${id}`);

export const getStoreBySlug = (slug: string) =>
  internalApiClient.get<StoreResponse>(`/api/stores/slug/${slug}`);

export const getTotalActiveStores = () => internalApiClient.get<number>("/api/stores/active/count");
