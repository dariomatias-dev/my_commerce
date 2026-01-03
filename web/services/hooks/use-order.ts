"use client";

import { useCallback } from "react";

import { OrderRequest } from "@/@types/order/order-request";
import { OrderResponse } from "@/@types/order/order-response";
import { PaginatedResponse } from "@/@types/paginated-response";
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

  const getOrderById = useCallback(
    (id: string, include?: "items") =>
      apiClient.get<OrderResponse | unknown>(`/orders/${id}`, {
        params: include ? { include } : undefined,
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
    getOrderById,
    deleteOrder,
  };
};
