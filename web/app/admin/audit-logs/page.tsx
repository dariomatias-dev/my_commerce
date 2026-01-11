"use client";

import {
  Activity,
  ArrowLeft,
  Filter,
  History,
  RefreshCcw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { Dropdown } from "@/components/dropdown";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { AuditAction } from "@/enums/audit-action";
import { useAuditLog } from "@/services/hooks/use-audit-log";

const ITEMS_PER_PAGE = 10;

const AdminAuditLogsPage = () => {
  const { getLogs, searchLogs } = useAuditLog();

  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [userIdSearch, setUserIdSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const auditActionOptions = [
    { id: "", name: "Todas as Ações" },
    ...Object.values(AuditAction).map((action) => ({
      id: action,
      name: action.replace("_", " ").toUpperCase(),
    })),
  ];

  const fetchLogs = useCallback(
    async (page: number, userId?: string, action?: string) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response =
          userId || action
            ? await searchLogs({ userId, action }, page, ITEMS_PER_PAGE)
            : await getLogs(page, ITEMS_PER_PAGE);

        setLogs(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Falha ao sincronizar registros de auditoria.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getLogs, searchLogs]
  );

  useEffect(() => {
    fetchLogs(currentPage, userIdSearch, actionFilter);
  }, [currentPage, fetchLogs, userIdSearch, actionFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setUserIdSearch(value);
    setCurrentPage(0);
  };

  const handleActionChange = (value: string) => {
    setActionFilter(value);
    setCurrentPage(0);
  };

  if (isLoading && logs.length === 0) {
    return <LoadingIndicator message="Acessando arquivos de log..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Erro de"
        highlightedTitle="Acesso"
        errorMessage={errorMessage}
        onRetry={() => fetchLogs(currentPage, userIdSearch, actionFilter)}
        backPath="/admin"
        backLabel="VOLTAR AO CONSOLE"
      />
    );
  }

  return (
    <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
      <div className="mb-12 border-b border-slate-200 pb-8">
        <Link
          href="/admin"
          className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft size={12} />
          Voltar ao Console
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded bg-slate-950 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
                <History size={10} />
                AUDIT_TRAIL
              </div>

              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
                Histórico completo de operações
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic md:text-5xl">
              LOGS DE <span className="text-indigo-600">AUDITORIA.</span>
            </h1>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row items-end">
            <div className="relative group w-full sm:w-64">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={16}
              />

              <input
                type="text"
                value={userIdSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="BUSCAR POR USER ID..."
                className="h-14.5 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-12 pr-6 text-[11px] font-black uppercase tracking-widest text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white sm:w-64"
              />
            </div>

            <Dropdown
              icon={Filter}
              options={auditActionOptions}
              value={actionFilter}
              onChange={handleActionChange}
              placeholder="Filtrar Ação"
              className="w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-opacity duration-300 min-h-120 flex flex-col">
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
              className={`divide-y divide-slate-50 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
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

        {isLoading && (
          <div className="flex flex-1 items-center justify-center border-t border-slate-50 bg-white/80 p-12">
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
              Nenhum registro encontrado para os filtros aplicados
            </span>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
};

export default AdminAuditLogsPage;
