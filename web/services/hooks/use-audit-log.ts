"use client";

import { useCallback } from "react";

import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { apiClient } from "@/services/api-client";

export const useAuditLog = () => {
  const getLogs = useCallback(
    (page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<AuditLogResponse>>("/audit-logs", {
        params: { page, size },
      }),
    []
  );

  const getLogById = useCallback(
    (id: string) => apiClient.get<AuditLogResponse>(`/audit-logs/${id}`),
    []
  );

  const searchLogs = useCallback(
    (
      filters: {
        userId?: string;
        action?: string;
        startDate?: string;
        endDate?: string;
      },
      page = 0,
      size = 10
    ) =>
      apiClient.get<PaginatedResponse<AuditLogResponse>>("/audit-logs/search", {
        params: { ...filters, page, size },
      }),
    []
  );

  return {
    getLogs,
    getLogById,
    searchLogs,
  };
};
