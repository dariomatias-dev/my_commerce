import { UserAddressResponse } from "@/@types/address/user-address-response";
import { internalApiClient } from "@/services/api-client";

export const getAllAddresses = () =>
  internalApiClient.get<UserAddressResponse[]>("/api/addresses");
