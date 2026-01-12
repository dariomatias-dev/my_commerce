"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { PasswordUpdateRequest } from "@/@types/user/password-update-request";
import { UserFilterDTO } from "@/@types/user/user-filter";
import { UserRequest } from "@/@types/user/user-request";
import { UserResponse } from "@/@types/user/user-response";
import { apiClient } from "@/services/api-client";

export const useUser = () => {
  const getAllUsers = useCallback(
    (filter: UserFilterDTO = {}, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<AdminUserResponse>>("/users", {
        params: { ...filter, page, size },
      }),
    []
  );

  const getUserById = useCallback(
    (id: string) => apiClient.get<AdminUserResponse>(`/users/${id}`),
    []
  );

  const getActiveUsersCount = useCallback(
    () => apiClient.get<number>("/users/stats/active-users"),
    []
  );

  const updateUser = useCallback(
    (id: string, data: Partial<UserRequest>) =>
      apiClient.patch<UserRequest>(`/users/${id}`, data),
    []
  );

  const deleteUser = useCallback(
    (id: string) => apiClient.delete<void>(`/users/${id}`),
    []
  );

  const getMe = useCallback(() => apiClient.get<UserResponse>("/users/me"), []);

  const updateMe = useCallback(
    (data: Partial<UserRequest>) =>
      apiClient.patch<UserRequest>("/users/me", data),
    []
  );

  const changePassword = useCallback(
    (data: PasswordUpdateRequest) =>
      apiClient.post<void>("/users/me/change-password", data),
    []
  );

  const deleteMe = useCallback(() => apiClient.delete<void>("/users/me"), []);

  return {
    getAllUsers,
    getUserById,
    getActiveUsersCount,
    updateUser,
    deleteUser,
    getMe,
    updateMe,
    changePassword,
    deleteMe,
  };
};
