"use client";

import { useCallback } from "react";

import { TotalRevenueResponse } from "@/@types/analytics/total-revenue-response";
import { UniqueCustomersResponse } from "@/@types/analytics/unique-customers-response";
import { apiClient } from "@/services/api-client";

export const useAnalytics = () => {
  const getUniqueCustomers = useCallback(
    () =>
      apiClient.get<UniqueCustomersResponse>(
        `/analytics/me/stats/unique-customers`
      ),
    []
  );

  const getTotalRevenue = useCallback(
    () =>
      apiClient.get<TotalRevenueResponse>(`/analytics/me/stats/total-revenue`),
    []
  );

  const getUniqueCustomersByStoreId = useCallback(
    (storeId: string) =>
      apiClient.get<UniqueCustomersResponse>(
        `/analytics/store/${storeId}/stats/unique-customers`
      ),
    []
  );

  const getTotalRevenueByStoreId = useCallback(
    (storeId: string) =>
      apiClient.get<TotalRevenueResponse>(
        `/analytics/store/${storeId}/stats/total-revenue`
      ),
    []
  );

  return {
    getUniqueCustomers,
    getTotalRevenue,
    getUniqueCustomersByStoreId,
    getTotalRevenueByStoreId,
  };
};
