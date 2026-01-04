"use client";

import { useCallback } from "react";

import { OrderRequest } from "@/@types/order/order-request";
import { OrderResponse } from "@/@types/order/order-response";
import { OrderWithItemsResponse } from "@/@types/order/order-with-items-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreResponse } from "@/@types/store/store-response";
import { apiClient } from "@/services/api-client";

export const useOrder = () => {
  const createOrder = useCallback(
    (data: OrderRequest) => apiClient.post<OrderResponse>("/orders", data),
    []
  );

  const getAllOrders = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<OrderResponse>>("/orders", {
        params: { page, size },
      }),
    []
  );

  const getOrdersByUserId = useCallback(
    (userId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<OrderResponse>>(
        `/orders/user/${userId}`,
        { params: { page, size } }
      ),
    []
  );

  const getOrdersByStoreId = useCallback(
    (storeId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<OrderResponse>>(
        `/orders/store/${storeId}`,
        { params: { page, size } }
      ),
    []
  );

  const getMyOrders = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<OrderResponse>>("/orders/me", {
        params: { page, size },
      }),
    []
  );

  const getMyOrderStores = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<StoreResponse>>("/orders/me/stores", {
        params: { page, size },
      }),
    []
  );

  const getMyOrdersByStore = useCallback(
    (storeId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<OrderResponse>>(
        `/orders/me/store/${storeId}`,
        { params: { page, size } }
      ),
    []
  );

  const getOrderById = useCallback(
    (id: string, include?: "items") =>
      apiClient.get<OrderResponse | OrderWithItemsResponse>(`/orders/${id}`, {
        params: include ? { include } : undefined,
      }),
    []
  );

  const getSuccessfulSalesCountByStoreId = useCallback(
    (storeId: string) =>
      apiClient.get<number>(`/orders/store/${storeId}/stats/successful-sales`, {
        params: { storeId },
      }),
    []
  );

  const deleteOrder = useCallback(
    (id: string) => apiClient.delete<void>(`/orders/${id}`),
    []
  );

  return {
    createOrder,
    getAllOrders,
    getOrdersByUserId,
    getOrdersByStoreId,
    getMyOrders,
    getMyOrderStores,
    getMyOrdersByStore,
    getOrderById,
    getSuccessfulSalesCountByStoreId,
    deleteOrder,
  };
};
