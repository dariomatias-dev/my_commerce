import { PaginatedResponse } from "@/@types/paginated-response";
import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { UserFilterDTO } from "@/@types/user/user-filter";
import { UserResponse } from "@/@types/user/user-response";
import { internalApiClient } from "@/services/api-client";

export const getUsers = (
  filter: UserFilterDTO = {},
  page = 0,
  size = 10
) =>
  internalApiClient.get<PaginatedResponse<AdminUserResponse>>("/api/users", {
    params: { ...filter, page, size },
  });

export const getUserById = (id: string) =>
  internalApiClient.get<AdminUserResponse>(`/api/users/${id}`);

export const getActiveUsersCount = () =>
  internalApiClient.get<number>("/api/users/stats/active-users");

export const getMe = () =>
  internalApiClient.get<UserResponse>("/api/users/me");
