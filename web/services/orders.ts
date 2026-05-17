import { OrderDetailsResponse } from "@/@types/order/order-details-response";
import { OrderResponse } from "@/@types/order/order-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreResponse } from "@/@types/store/store-response";
import { internalApiClient } from "@/services/api-client";

export const getAllOrders = (page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<OrderResponse>>("/api/orders", {
    params: { page, size },
  });

export const getOrdersByUserId = (userId: string, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<OrderResponse>>(`/api/orders/user/${userId}`, {
    params: { page, size },
  });

export const getOrdersByStoreId = (storeId: string, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<OrderResponse>>(`/api/orders/store/${storeId}`, {
    params: { page, size },
  });

export const getMyOrders = (page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<OrderResponse>>("/api/orders/me", {
    params: { page, size },
  });

export const getMyOrderStores = (page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<StoreResponse>>("/api/orders/me/stores", {
    params: { page, size },
  });

export const getMyOrdersByStore = (storeId: string, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<OrderResponse>>(`/api/orders/me/store/${storeId}`, {
    params: { page, size },
  });

export const getOrderById = (id: string) =>
  internalApiClient.get<OrderDetailsResponse>(`/api/orders/${id}`);

export const getSuccessfulSalesCountByStoreId = (storeId: string) =>
  internalApiClient.get<number>(`/api/orders/store/${storeId}/stats/successful-sales`);
