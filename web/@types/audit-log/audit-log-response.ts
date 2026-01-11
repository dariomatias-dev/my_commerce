export interface AuditLogResponse {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  result: string;
  details: Record<string, unknown>;
}
