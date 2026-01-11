"use client";

import { ArrowRight, History } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { useAuditLog } from "@/services/hooks/use-audit-log";
import { AuditLogTable } from "../audit-log-table";

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

      <div className="min-h-100 flex flex-col">
        {error ? (
          <div className="flex flex-1 flex-col items-center justify-center p-12 text-center rounded-[2.5rem] border border-slate-100 bg-white">
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
          <AuditLogTable logs={logs} isLoading={isLoading} />
        )}
      </div>
    </section>
  );
};
