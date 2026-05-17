import { AuditLogFilter } from "@/@types/audit-log/audit-log-filter";
import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { internalApiClient } from "@/services/api-client";

export const getLogs = (filters?: AuditLogFilter, page = 0, size = 10) =>
  internalApiClient.get<PaginatedResponse<AuditLogResponse>>("/api/audit-logs", {
    params: { ...filters, page, size },
  });

export const getLogById = (id: string) =>
  internalApiClient.get<AuditLogResponse>(`/api/audit-logs/${id}`);
