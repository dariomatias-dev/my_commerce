"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
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

  const getAllStores = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<StoreResponse>>("/stores", {
        params: { page, size },
      }),
    []
  );

  const getStoresByUserId = useCallback(
    (userId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<StoreResponse>>(
        `/stores/user/${userId}`,
        {
          params: { page, size },
        }
      ),
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
    getAllStores,
    getStoresByUserId,
    getStoreById,
    getStoreBySlug,
    updateStore,
    deleteStore,
  };
};
