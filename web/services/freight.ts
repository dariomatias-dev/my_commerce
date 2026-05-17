import { FreightResponse } from "@/@types/freight/freight-response";
import { internalApiClient } from "@/services/api-client";

export const calculateFreight = (userAddressId: string) =>
  internalApiClient.get<FreightResponse>(`/api/freight/${userAddressId}`);
