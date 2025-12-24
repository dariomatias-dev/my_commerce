"use client";

import { useCallback } from "react";

import { PaginatedResponse } from "@/@types/paginated-response";
import { TransactionResponse } from "@/@types/transaction/transaction-response";
import { useApi } from "./use-api";

export const useTransaction = () => {
  const api = useApi();

  const getAllTransactions = useCallback(
    (page = 0, size = 10) =>
      api.get<PaginatedResponse<TransactionResponse>>("/transactions", {
        params: { page, size },
      }),
    [api]
  );

  const getTransactionsByStoreSlug = useCallback(
    (storeSlug: string, page = 0, size = 10) =>
      api.get<PaginatedResponse<TransactionResponse>>(
        `/transactions/store/slug/${storeSlug}`,
        { params: { page, size } }
      ),
    [api]
  );

  const getTransactionsByUserId = useCallback(
    (userId: string, page = 0, size = 10) =>
      api.get<PaginatedResponse<TransactionResponse>>(
        `/transactions/user/${userId}`,
        { params: { page, size } }
      ),
    [api]
  );

  const getTransactionsByMe = useCallback(
    (page = 0, size = 10) =>
      api.get<PaginatedResponse<TransactionResponse>>("/transactions/me", {
        params: { page, size },
      }),
    [api]
  );

  const getTransactionsByOrderId = useCallback(
    (orderId: string, page = 0, size = 10) =>
      api.get<PaginatedResponse<TransactionResponse>>(
        `/transactions/order/${orderId}`,
        { params: { page, size } }
      ),
    [api]
  );

  const getTransactionById = useCallback(
    (id: string) => api.get<TransactionResponse>(`/transactions/${id}`),
    [api]
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
