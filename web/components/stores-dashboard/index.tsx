"use client";

import { Filter, Store } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreFilter } from "@/@types/store/store-filter";
import { StoreResponse } from "@/@types/store/store-response";
import { Dropdown } from "@/components/dropdown";
import { Pagination } from "@/components/pagination";
import { StatusFilter } from "@/enums/status-filter";
import { StoresList } from "../stores-list";
import { StoresDashboardEmptyStores } from "./stores-dashboard-empty-stores";
import { StoresDashboardPageHeader } from "./stores-dashboard-page-header";

interface StoresDashboardProps {
  fetchFunction: (
    filters: StoreFilter,
    page: number,
    size: number
  ) => Promise<PaginatedResponse<StoreResponse>>;
  headerTitle: string;
  headerSubtitle: string;
  canCreate?: boolean;
  backPath: string;
  userId?: string;
  showStatusFilter?: boolean;
}

export const StoresDashboard = ({
  fetchFunction,
  headerTitle,
  headerSubtitle,
  canCreate = true,
  backPath,
  userId,
  showStatusFilter = false,
}: StoresDashboardProps) => {
  const listTopRef = useRef<HTMLDivElement>(null);

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const pageSize = 9;

  const statusOptions = [
    { id: "", name: "Todos os Status" },
    { id: StatusFilter.ACTIVE, name: "Ativos" },
    { id: StatusFilter.DELETED, name: "Removidos" },
  ];

  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: StoreFilter = {
        userId: userId || "",
        status: (statusFilter as StatusFilter) || undefined,
      };

      const response = await fetchFunction(filters, currentPage, pageSize);

      setStores(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível carregar as informações das lojas.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize, statusFilter, userId]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(0);
  };

  if (stores.length === 0 && !error && !isLoading && !statusFilter) {
    return <StoresDashboardEmptyStores />;
  }

  return (
    <main className="min-h-screen font-sans text-slate-900">
      <div className="mx-auto max-w-400 px-6 pt-40 pb-20">
        <div
          ref={listTopRef}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700 scroll-mt-40"
        >
          <div className="mb-12">
            <StoresDashboardPageHeader
              currentPage={currentPage}
              totalPages={totalPages}
              title={headerTitle}
              subtitle={headerSubtitle}
              showCreateButton={canCreate}
              backPath={backPath}
              actions={
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <Store size={20} />
                  </div>
                  <div className="pr-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Total Encontrado
                    </p>
                    <p className="text-lg font-black text-slate-950">
                      {String(totalElements).padStart(2, "0")} Lojas
                    </p>
                  </div>
                </div>
              }
            />
          </div>

          {showStatusFilter && (
            <div className="mb-12 flex justify-end">
              <Dropdown
                icon={Filter}
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusChange}
                placeholder="Filtrar por Status"
                className="w-full sm:w-72"
              />
            </div>
          )}

          {stores.length > 0 ? (
            <StoresList stores={stores} onRetry={fetchStores} />
          ) : (
            <div className="rounded-[3rem] border-2 border-dashed border-slate-100 py-32 text-center">
              <p className="text-xs font-black uppercase italic tracking-widest text-slate-300">
                Nenhuma loja localizada para os critérios selecionados
              </p>
            </div>
          )}

          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
