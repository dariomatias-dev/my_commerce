"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreRequest } from "@/@types/store/store-request";
import { StoreResponse } from "@/@types/store/store-response";
import { useApi } from "./use-api";

export const useStore = () => {
  const api = useApi();

  const createStore = useCallback(
    (data: StoreRequest, logo: File, banner: File) => {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      formData.append("logo", logo);
      formData.append("banner", banner);

      return api.post<StoreResponse>("/stores", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    [api]
  );

  const getAllStores = useCallback(
    (page = 0, size = 10) =>
      api.get<PaginatedResponse<StoreResponse>>("/stores", {
        params: { page, size },
      }),
    [api]
  );

  const getStoresByUserId = useCallback(
    (userId: string, page = 0, size = 10) =>
      api.get<PaginatedResponse<StoreResponse>>(`/stores/user/${userId}`, {
        params: { page, size },
      }),
    [api]
  );

  const getStoreById = useCallback(
    (id: string) => api.get<StoreResponse>(`/stores/${id}`),
    [api]
  );

  const getStoreBySlug = useCallback(
    (slug: string) => api.get<StoreResponse>(`/stores/slug/${slug}`),
    [api]
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

      return api.patch<StoreResponse>(`/stores/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    [api]
  );

  const deleteStore = useCallback(
    (id: string) => api.delete<void>(`/stores/${id}`),
    [api]
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
