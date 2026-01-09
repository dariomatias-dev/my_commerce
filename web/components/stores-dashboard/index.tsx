"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { PaginatedResponse } from "@/@types/paginated-response";
import { StoreResponse } from "@/@types/store/store-response";
import { Pagination } from "@/components/pagination";
import { StoresList } from "../stores-list";
import { StoresDashboardEmptyStores } from "./stores-dashboard-empty-stores";
import { StoresDashboardPageHeader } from "./stores-dashboard-page-header";

interface StoresDashboardProps {
  fetchFunction: (
    page: number,
    size: number
  ) => Promise<PaginatedResponse<StoreResponse>>;
  headerTitle: string;
  headerSubtitle: string;
  canCreate?: boolean;
  backPath: string;
}

export const StoresDashboard = ({
  fetchFunction,
  headerTitle,
  headerSubtitle,
  canCreate = true,
  backPath,
}: StoresDashboardProps) => {
  const listTopRef = useRef<HTMLDivElement>(null);

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;

  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFunction(currentPage, pageSize);

      setStores(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível carregar as informações das lojas.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (stores.length === 0 && !error && !isLoading) {
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
            backPath={backPath}
          />

          <StoresList
            stores={stores}
            isLoading={isLoading}
            errorMessage={error}
            onRetry={fetchStores}
          />

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
