"use client";

import { Activity } from "lucide-react";

import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { getAuditLogResultConfig } from "@/utils/get-audit-log-result-config";

interface AuditLogTableItemProps {
  log: AuditLogResponse;
}

export const AuditLogTableItem = ({ log }: AuditLogTableItemProps) => {
  const status = getAuditLogResultConfig(log.result);

  return (
    <tr className="group transition-colors hover:bg-slate-50/50">
      <td className="px-8 py-5">
        <span className="text-xs font-black text-slate-950 uppercase italic">{log.action}</span>
      </td>

      <td className="px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
            <Activity size={12} />
          </div>

          <span className="text-[11px] font-bold text-slate-600">{log.userId}</span>
        </div>
      </td>

      <td className="px-8 py-5">
        <span className={`text-[10px] font-black tracking-tighter uppercase ${status.color}`}>
          {status.label}
        </span>
      </td>

      <td className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase">
        {new Date(log.timestamp).toLocaleString("pt-BR")}
      </td>
    </tr>
  );
};
