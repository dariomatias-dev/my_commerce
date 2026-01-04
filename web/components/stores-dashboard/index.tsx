"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreResponse } from "@/@types/store/store-response";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { StoresDashboardCard } from "./stores-dashboard-card";
import { StoresDashboardEmptyStores } from "./stores-dashboard-empty-stores";
import { StoresDashboardErrorCard } from "./stores-dashboard-error-card";
import { StoresDashboardPageHeader } from "./stores-dashboard-page-header";

interface StoresDashboardProps {
  fetchFunction: (
    page: number,
    size: number
  ) => Promise<PaginatedResponse<StoreResponse>>;
  deleteFunction: (id: string) => Promise<void>;
  headerTitle: string;
  headerSubtitle: string;
  canCreate?: boolean;
}

export const StoresDashboard = ({
  fetchFunction,
  deleteFunction,
  headerTitle,
  headerSubtitle,
  canCreate = true,
}: StoresDashboardProps) => {
  const listTopRef = useRef<HTMLDivElement>(null);

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFunction(currentPage, pageSize);

      setStores(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível carregar as informações das lojas."
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, currentPage]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleDeleteStore = async (id: string) => {
    try {
      setError(null);

      await deleteFunction(id);

      setStores((prev) => prev.filter((store) => store.id !== id));

      if (stores.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir a instância da loja."
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return <LoadingIndicator message="Sincronizando instâncias..." />;
  }

  if (error != null) {
    return (
      <StoresDashboardErrorCard
        title="Erro de Sincronização."
        message={error}
        icon={<AlertCircle size={64} className="text-red-500" />}
        action={
          <button
            onClick={fetchStores}
            className="flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 shadow-xl"
          >
            <RefreshCcw size={20} /> RECONECTAR
          </button>
        }
      />
    );
  }

  if (stores.length === 0 && !error) {
    return <StoresDashboardEmptyStores />;
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <div className="mx-auto max-w-400 px-6 pt-40 pb-20">
        <div
          ref={listTopRef}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700 scroll-mt-40"
        >
          <StoresDashboardPageHeader
            currentPage={currentPage}
            totalPages={totalPages}
            title={headerTitle}
            subtitle={headerSubtitle}
            showCreateButton={canCreate}
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoresDashboardCard
                key={store.id}
                store={store}
                onDelete={handleDeleteStore}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
};
