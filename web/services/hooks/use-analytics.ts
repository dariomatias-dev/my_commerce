"use client";

import { useCallback } from "react";

import { apiClient } from "@/services/api-client";
import { ConversionRateResponse } from "@/@types/analytics/conversion-rate-response";
import { VisitorsPerHourResponse } from "@/@types/analytics/visitors-per-hour-response";

export const useAnalytics = () => {
  const getVisitorsPerHourByStoreId = useCallback(
    (storeId: string) =>
      apiClient.get<Array<VisitorsPerHourResponse>>(`/analytics/store/${storeId}/stats/activity-log`),
    []
  );

  const getConversionRateByStoreId = useCallback(
    (storeId: string) =>
      apiClient.get<ConversionRateResponse>(`/analytics/store/${storeId}/stats/conversion-rate`),
    []
  );

  return {
    getVisitorsPerHourByStoreId,
    getConversionRateByStoreId,
  };
};
