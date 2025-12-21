"use client";

import { PaginatedResponse } from "@/@types/paginated-response";
import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { PasswordUpdateRequest } from "@/@types/user/password-update-request";
import { UserResponse } from "@/@types/user/user-response";
import { useApi } from "./use-api";

export const useUser = () => {
  const api = useApi();

  const getAllUsers = (page = 0, size = 10) =>
    api.get<PaginatedResponse<AdminUserResponse>>("/users", {
      params: { page, size },
    });

  const getUserById = (id: string) =>
    api.get<AdminUserResponse>(`/users/${id}`);

  const updateUser = (id: string, data: Partial<AdminUserResponse>) =>
    api.patch<AdminUserResponse>(`/users/${id}`, data);

  const deleteUser = (id: string) => api.delete<void>(`/users/${id}`);

  const getMe = () => api.get<UserResponse>("/users/me");

  const updateMe = (data: Partial<UserResponse>) =>
    api.patch<UserResponse>("/users/me", data);

  const changePassword = (data: PasswordUpdateRequest) =>
    api.post<void>("/users/me/change-password", data);

  const deleteMe = () => api.delete<void>("/users/me");

  return {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMe,
    updateMe,
    changePassword,
    deleteMe,
  };
};
