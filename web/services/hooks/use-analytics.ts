"use client";

import { useCallback } from "react";

import { ConversionRateResponse } from "@/@types/analytics/conversion-rate-response";
import { UniqueCustomersResponse } from "@/@types/analytics/unique-customers-response";
import { VisitorsPerHourResponse } from "@/@types/analytics/visitors-per-hour-response";
import { apiClient } from "@/services/api-client";

export const useAnalytics = () => {
  const getVisitorsPerHourByStoreId = useCallback(
    (storeId: string) =>
      apiClient.get<Array<VisitorsPerHourResponse>>(
        `/analytics/store/${storeId}/stats/activity-log`
      ),
    []
  );

  const getConversionRateByStoreId = useCallback(
    (storeId: string) =>
      apiClient.get<ConversionRateResponse>(
        `/analytics/store/${storeId}/stats/conversion-rate`
      ),
    []
  );

  const getUniqueCustomers = useCallback(
    () =>
      apiClient.get<UniqueCustomersResponse>(
        `/analytics/me/stats/unique-customers`
      ),
    []
  );

  return {
    getVisitorsPerHourByStoreId,
    getConversionRateByStoreId,
    getUniqueCustomers,
  };
};
