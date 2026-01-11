"use client";

import { Activity, ArrowRight, History, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { useAuditLog } from "@/services/hooks/use-audit-log";
import Link from "next/link";

export const AdminAuditLogTable = () => {
  const { getLogs } = useAuditLog();
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getLogs({}, 0, 8);

      setLogs(response.content || []);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Erro ao carregar logs");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg">
            <History size={20} />
          </div>

          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
            Logs de <span className="text-indigo-600">Auditoria</span>
          </h2>
        </div>

        <Link
          href="admin/audit-logs"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Ver Tudo
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm min-h-100 flex flex-col">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCcw className="h-8 w-8 animate-spin text-indigo-600" />

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Sincronizando registros...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
            <p className="mb-4 text-xs font-bold text-red-500 uppercase tracking-widest">
              {error}
            </p>

            <button
              onClick={fetchLogs}
              className="text-[10px] font-black uppercase underline tracking-widest text-slate-950"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
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

              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-8 py-5">
                      <span className="text-xs font-black uppercase italic text-slate-950">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500">
                          <Activity size={12} />
                        </div>

                        <span className="text-[11px] font-bold text-slate-600">
                          {log.userId}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-950">
                        {log.result}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-[11px] font-bold uppercase text-slate-500">
                      {new Date(log.timestamp).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
