import { PaginatedResponse } from "@/@types/paginated-response";
import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";
import { internalApiClient } from "@/services/api-client";

export const getAllPlans = (page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<SubscriptionPlanResponse>>("/api/subscription-plans", {
    params: { page, size },
  });

export const getPlanById = (id: string) =>
  internalApiClient.get<SubscriptionPlanResponse>(`/api/subscription-plans/${id}`);
