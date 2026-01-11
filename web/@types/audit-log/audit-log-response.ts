import { AuditLogAction } from "@/enums/audit-action";

export type AuditLogResult = "success" | "failure";

export interface AuditLogResponse {
  id: string;
  timestamp: string;
  userId: string;
  action: AuditLogAction;
  result: AuditLogResult;
  details: Record<string, unknown>;
}
