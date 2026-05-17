import { TotalRevenueResponse } from "@/@types/analytics/total-revenue-response";
import { UniqueCustomersResponse } from "@/@types/analytics/unique-customers-response";
import { internalApiClient } from "@/services/api-client";

export const getUniqueCustomers = () =>
  internalApiClient.get<UniqueCustomersResponse>("/api/analytics/me/stats/unique-customers");

export const getMyTotalRevenue = () =>
  internalApiClient.get<TotalRevenueResponse>("/api/analytics/me/stats/total-revenue");

export const getUniqueCustomersByStoreId = (storeId: string) =>
  internalApiClient.get<UniqueCustomersResponse>(
    `/api/analytics/store/${storeId}/stats/unique-customers`,
  );

export const getTotalRevenueByStoreId = (storeId: string) =>
  internalApiClient.get<TotalRevenueResponse>(
    `/api/analytics/store/${storeId}/stats/total-revenue`,
  );

export const getTotalRevenue = () =>
  internalApiClient.get<TotalRevenueResponse>("/api/analytics/total-revenue");
