"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { DashboardEmptyStores } from "@/components/dashboard/dashboard-empty-stores";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { StoreCard } from "@/components/dashboard/dashboard-store-card";
import { Pagination } from "@/components/pagination";
import { useAuthContext } from "@/contexts/auth-context";
import { useStore } from "@/services/hooks/use-store";

const DashboardPage = () => {
  const { user } = useAuthContext();
  const { getStoresByUserId, deleteStore } = useStore();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchStores = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getStoresByUserId(user.id, currentPage, pageSize);

      setStores(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar as informações da loja.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getStoresByUserId, currentPage]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleDeleteStore = async (id: string) => {
    try {
      setError(null);

      await deleteStore(id);

      setStores((prev) => prev.filter((store) => store.id !== id));

      if (stores.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível excluir a instância da loja.");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <div className="mx-auto max-w-400 px-6 pt-40 pb-20">
        <div
          ref={listTopRef}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700 scroll-mt-40"
        >
          <DashboardPageHeader
            currentPage={currentPage}
            totalPages={totalPages}
          />

          {error && (
            <div className="mb-8">
              <DashboardError message={error} onRetry={fetchStores} />
            </div>
          )}

          {isLoading ? (
            <DashboardLoading />
          ) : stores.length === 0 && !error ? (
            <DashboardEmptyStores />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {stores.map((store) => (
                  <StoreCard
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
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
