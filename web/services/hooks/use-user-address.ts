"use client";

import { useCallback } from "react";

import { UserAddressRequest } from "@/@types/address/user-address-request";
import { UserAddressResponse } from "@/@types/address/user-address-response";
import { apiClient } from "@/services/api-client";

export const useUserAddress = () => {
  const createAddress = useCallback(
    (data: UserAddressRequest) =>
      apiClient.post<UserAddressResponse>("/addresses", data),
    []
  );

  const getAllAddresses = useCallback(
    () => apiClient.get<UserAddressResponse[]>("/addresses"),
    []
  );

  const updateAddress = useCallback(
    (id: string, data: UserAddressRequest) =>
      apiClient.put<UserAddressResponse>(`/addresses/${id}`, data),
    []
  );

  const deleteAddress = useCallback(
    (id: string) => apiClient.delete<void>(`/addresses/${id}`),
    []
  );

  return {
    createAddress,
    getAllAddresses,
    updateAddress,
    deleteAddress,
  };
};
