"use client";

import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { RefreshCcw } from "lucide-react";
import { AuditLogTableItem } from "./audit-log-table-item";

interface AuditLogTableProps {
  logs: AuditLogResponse[];
  isLoading: boolean;
}

export const AuditLogTable = ({ logs, isLoading }: AuditLogTableProps) => {
  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm flex-1 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Ação Realizada
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Usuário
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Data / Hora
              </th>
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-slate-50 transition-opacity duration-300 ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
          >
            {logs.map((log) => (
              <AuditLogTableItem key={log.id} log={log} />
            ))}
          </tbody>
        </table>
      </div>

      {isLoading && logs.length === 0 && (
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <RefreshCcw size={24} className="animate-spin text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Sincronizando registros...
            </span>
          </div>
        </div>
      )}

      {!isLoading && logs.length === 0 && (
        <div className="flex flex-1 items-center justify-center p-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Nenhum registro encontrado
          </span>
        </div>
      )}
    </div>
  );
};
