import { AuditLogAction } from "@/enums/audit-action";

export interface AuditLogResponse {
  id: string;
  timestamp: string;
  userId: string;
  action: AuditLogAction;
  result: string;
  details: Record<string, unknown>;
}
