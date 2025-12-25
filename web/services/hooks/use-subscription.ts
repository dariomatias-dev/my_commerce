"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { SubscriptionRequest } from "@/@types/subscription/subscription-request";
import { SubscriptionResponse } from "@/@types/subscription/subscription-response";
import { apiClient } from "@/services/api-client";

export const useSubscription = () => {
  const createSubscription = useCallback(
    (data: SubscriptionRequest) =>
      apiClient.post<SubscriptionResponse>("/subscriptions", data),
    []
  );

  const getAllSubscriptions = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<SubscriptionResponse>>("/subscriptions", {
        params: { page, size },
      }),
    []
  );

  const getMySubscriptions = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<SubscriptionResponse>>(
        "/subscriptions/user/me",
        {
          params: { page, size },
        }
      ),
    []
  );

  const getSubscriptionsByUserId = useCallback(
    (userId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<SubscriptionResponse>>(
        `/subscriptions/user/${userId}`,
        {
          params: { page, size },
        }
      ),
    []
  );

  const getMyActiveSubscription = useCallback(
    () => apiClient.get<SubscriptionResponse>("/subscriptions/me/active"),
    []
  );

  const getSubscriptionById = useCallback(
    (id: string) => apiClient.get<SubscriptionResponse>(`/subscriptions/${id}`),
    []
  );

  const changeSubscriptionPlan = useCallback(
    (data: SubscriptionRequest) =>
      apiClient.patch<SubscriptionResponse>("/subscriptions/change-plan", data),
    []
  );

  return {
    createSubscription,
    getAllSubscriptions,
    getMySubscriptions,
    getSubscriptionsByUserId,
    getMyActiveSubscription,
    getSubscriptionById,
    changeSubscriptionPlan,
  };
};
