"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { SubscriptionPlanRequest } from "@/@types/subscription-plan/subscription-plan-request";
import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";
import { useApi } from "./use-api";

export const useSubscriptionPlan = () => {
  const api = useApi();

  const createPlan = useCallback(
    (data: SubscriptionPlanRequest) =>
      api.post<SubscriptionPlanResponse>("/subscription-plans", data),
    [api]
  );

  const getAllPlans = useCallback(
    (page = 0, size = 10) =>
      api.get<PaginatedResponse<SubscriptionPlanResponse>>(
        "/subscription-plans",
        {
          params: { page, size },
        }
      ),
    [api]
  );

  const getPlanById = useCallback(
    (id: string) =>
      api.get<SubscriptionPlanResponse>(`/subscription-plans/${id}`),
    [api]
  );

  const updatePlan = useCallback(
    (id: string, data: Partial<SubscriptionPlanRequest>) =>
      api.patch<SubscriptionPlanResponse>(`/subscription-plans/${id}`, data),
    [api]
  );

  const deletePlan = useCallback(
    (id: string) => api.delete<void>(`/subscription-plans/${id}`),
    [api]
  );

  return {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
  };
};
