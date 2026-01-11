"use client";

import { ArrowLeft, Filter, History, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AuditLogResponse } from "@/@types/audit-log/audit-log-response";
import { AuditLogTable } from "@/components/audit-log-table";
import { Dropdown } from "@/components/dropdown";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { AuditLogAction } from "@/enums/audit-action";
import { useAuditLog } from "@/services/hooks/use-audit-log";
import { getAuditLogActionConfigs } from "@/utils/get-audit-log-action-config";

const ITEMS_PER_PAGE = 10;

const AdminAuditLogsPage = () => {
  const { getLogs } = useAuditLog();

  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const auditlogActionOptions = [
    { id: "", name: "Todas as Ações" },
    ...Object.values(AuditLogAction).map((action) => ({
      id: action,
      name: getAuditLogActionConfigs(action),
    })),
  ];

  const fetchLogs = useCallback(
    async (page: number, userId?: string, action?: string) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const filters = {
          userId: userId || undefined,
          action: action || undefined,
        };

        const response = await getLogs(filters, page, ITEMS_PER_PAGE);

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
    [getLogs]
  );

  useEffect(() => {
    fetchLogs(currentPage, userIdSearch, actionFilter);
  }, [currentPage, fetchLogs, userIdSearch, actionFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = () => {
    setUserIdSearch(inputValue);
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
    <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12 flex flex-col">
      <div className="mb-12 border-b border-slate-200 pb-8">
        <Link
          href="/admin"
          className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft size={12} />
          Voltar ao Console
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded bg-slate-950 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
                <History size={10} />
                AUDIT_LOGS
              </div>

              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
                Histórico completo de operações
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic md:text-5xl">
              LOGS DE <span className="text-indigo-600">AUDITORIA.</span>
            </h1>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row items-end w-full lg:w-auto">
            <div className="relative group w-full lg:w-112.5">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={16}
              />

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder="PESQUISAR POR IDENTIFICADOR DE USUÁRIO (UUID)..."
                className="h-14.5 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <Dropdown
              icon={Filter}
              options={auditlogActionOptions}
              value={actionFilter}
              onChange={handleActionChange}
              placeholder="Filtrar Ação"
              className="w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="min-h-120 flex flex-col">
        <AuditLogTable logs={logs} isLoading={isLoading} />
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
