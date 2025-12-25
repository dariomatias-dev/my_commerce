"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { SubscriptionPlanRequest } from "@/@types/subscription-plan/subscription-plan-request";
import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";
import { apiClient } from "@/services/api-client";

export const useSubscriptionPlan = () => {
  const createPlan = useCallback(
    (data: SubscriptionPlanRequest) =>
      apiClient.post<SubscriptionPlanResponse>("/subscription-plans", data),
    []
  );

  const getAllPlans = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<SubscriptionPlanResponse>>(
        "/subscription-plans",
        {
          params: { page, size },
        }
      ),
    []
  );

  const getPlanById = useCallback(
    (id: string) =>
      apiClient.get<SubscriptionPlanResponse>(`/subscription-plans/${id}`),
    []
  );

  const updatePlan = useCallback(
    (id: string, data: Partial<SubscriptionPlanRequest>) =>
      apiClient.patch<SubscriptionPlanResponse>(
        `/subscription-plans/${id}`,
        data
      ),
    []
  );

  const deletePlan = useCallback(
    (id: string) => apiClient.delete<void>(`/subscription-plans/${id}`),
    []
  );

  return {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
  };
};
