"use client";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { StoreCard } from "@/components/dashboard/dashboard-store-card";
import { useAuthContext } from "@/contexts/auth-context";
import { useStore } from "@/services/hooks/use-store";
import { useCallback, useEffect, useRef, useState } from "react";

import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardPagination } from "@/components/dashboard/dashboard-pagination";

const DashboardPage = () => {
  const { user } = useAuthContext();
  const { getStoresByUserId } = useStore();
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="mx-auto max-w-400 px-6 pt-40 pb-20">
      <div
        ref={listTopRef}
        className="animate-in fade-in slide-in-from-bottom-4 duration-700 scroll-mt-40"
      >
        <DashboardPageHeader
          currentPage={currentPage}
          totalPages={totalPages}
        />

        {isLoading ? (
          <DashboardLoading />
        ) : error ? (
          <DashboardError message={error} onRetry={fetchStores} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>

            <DashboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
