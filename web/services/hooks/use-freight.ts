"use client";

import { useCallback } from "react";

import { apiClient } from "@/services/api-client";
import { FreightResponse } from "@/@types/freight/freight-response";

export const useFreight = () => {
  const calculateFreight = useCallback(
    (userAddressId: string) =>
      apiClient.get<FreightResponse>(`/freight/${userAddressId}`),
    []
  );

  return {
    calculateFreight,
  };
};
