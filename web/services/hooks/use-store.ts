"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreFilter } from "@/@types/store/store-filter";
import { StoreRequest } from "@/@types/store/store-request";
import { StoreResponse } from "@/@types/store/store-response";
import { apiClient } from "@/services/api-client";

export const useStore = () => {
  const createStore = useCallback(
    (data: StoreRequest, logo: File, banner: File) => {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      formData.append("logo", logo);
      formData.append("banner", banner);

      return apiClient.post<StoreResponse>("/stores", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    []
  );

  const getAllByUser = useCallback(
    (filters: StoreFilter, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<StoreResponse>>("/stores", {
        params: { ...filters, page, size },
      }),
    []
  );

  const getMyStores = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<StoreResponse>>("/stores/me", {
        params: { page, size },
      }),
    []
  );

  const getStoreById = useCallback(
    (id: string) => apiClient.get<StoreResponse>(`/stores/${id}`),
    []
  );

  const getStoreBySlug = useCallback(
    (slug: string) => apiClient.get<StoreResponse>(`/stores/slug/${slug}`),
    []
  );

  const getTotalActiveStores = useCallback(
    () => apiClient.get<number>("/stores/active/count"),
    []
  );

  const getNewActiveStoresThisMonth = useCallback(
    () => apiClient.get<number>("/stores/active/new-this-month"),
    []
  );

  const updateStore = useCallback(
    (id: string, data?: Partial<StoreRequest>, logo?: File, banner?: File) => {
      const formData = new FormData();
      if (data) {
        formData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
      }
      if (logo) formData.append("logo", logo);
      if (banner) formData.append("banner", banner);

      return apiClient.patch<StoreResponse>(`/stores/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    []
  );

  const deleteStore = useCallback(
    (id: string) => apiClient.delete<void>(`/stores/${id}`),
    []
  );

  return {
    createStore,
    getAllByUser,
    getMyStores,
    getStoreById,
    getStoreBySlug,
    getTotalActiveStores,
    getNewActiveStoresThisMonth,
    updateStore,
    deleteStore,
  };
};
