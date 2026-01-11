"use client";

import { useCallback } from "react";

import { AuditLogFilter } from "@/@types/audit-log/audit-log-filter";
import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { apiClient } from "@/services/api-client";

export const useAuditLog = () => {
  const getLogs = useCallback(
    (filters?: AuditLogFilter, page = 0, size = 10) =>
      apiClient.get<PaginatedResponse<AuditLogResponse>>("/audit-logs", {
        params: { ...filters, page, size },
      }),
    []
  );

  const getLogById = useCallback(
    (id: string) => apiClient.get<AuditLogResponse>(`/audit-logs/${id}`),
    []
  );

  return {
    getLogs,
    getLogById,
  };
};
