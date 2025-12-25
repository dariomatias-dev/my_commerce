"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { TransactionResponse } from "@/@types/transaction/transaction-response";
import { apiClient } from "@/services/api-client";

export const useTransaction = () => {
  const getAllTransactions = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<TransactionResponse>>("/transactions", {
        params: { page, size },
      }),
    []
  );

  const getTransactionsByStoreSlug = useCallback(
    (storeSlug: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<TransactionResponse>>(
        `/transactions/store/slug/${storeSlug}`,
        { params: { page, size } }
      ),
    []
  );

  const getTransactionsByUserId = useCallback(
    (userId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<TransactionResponse>>(
        `/transactions/user/${userId}`,
        { params: { page, size } }
      ),
    []
  );

  const getTransactionsByMe = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<TransactionResponse>>(
        "/transactions/me",
        {
          params: { page, size },
        }
      ),
    []
  );

  const getTransactionsByOrderId = useCallback(
    (orderId: string, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<TransactionResponse>>(
        `/transactions/order/${orderId}`,
        { params: { page, size } }
      ),
    []
  );

  const getTransactionById = useCallback(
    (id: string) => apiClient.get<TransactionResponse>(`/transactions/${id}`),
    []
  );

  return {
    getAllTransactions,
    getTransactionsByStoreSlug,
    getTransactionsByUserId,
    getTransactionsByMe,
    getTransactionsByOrderId,
    getTransactionById,
  };
};
