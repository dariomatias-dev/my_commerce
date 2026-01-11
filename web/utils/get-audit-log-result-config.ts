import { AuditLogResult } from "@/@types/audit-log/audit-log-response";

const auditLogResultConfigs: Record<
  AuditLogResult,
  { label: string; color: string }
> = {
  success: {
    label: "Sucesso",
    color: "text-emerald-600",
  },
  failure: {
    label: "Falha",
    color: "text-red-500",
  },
};

export const getAuditLogResultConfig = (result: AuditLogResult) => {
  return (
    auditLogResultConfigs[result] || {
      label: "Desconhecido",
      color: "text-slate-400",
    }
  );
};
