import { PaginatedResponse } from "@/@types/paginated-response";
import { SubscriptionResponse } from "@/@types/subscription/subscription-response";
import { internalApiClient } from "@/services/api-client";

export const getAllSubscriptions = (page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<SubscriptionResponse>>("/api/subscriptions", {
    params: { page, size },
  });

export const getMySubscriptions = (page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<SubscriptionResponse>>("/api/subscriptions/user/me", {
    params: { page, size },
  });

export const getSubscriptionsByUserId = (userId: string, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<SubscriptionResponse>>(
    `/api/subscriptions/user/${userId}`,
    { params: { page, size } },
  );

export const getMyActiveSubscription = () =>
  internalApiClient.get<SubscriptionResponse>("/api/subscriptions/me/active");

export const getSubscriptionById = (id: string) =>
  internalApiClient.get<SubscriptionResponse>(`/api/subscriptions/${id}`);
