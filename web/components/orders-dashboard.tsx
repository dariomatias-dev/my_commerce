"use client";

import { Package, Tag } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderResponse } from "@/@types/order/order-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { ErrorFeedback } from "@/components/error-feedback";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { DashboardTotalBadge } from "./dashboard-total-badge";
import { OrderCard } from "./orders/order-card";

interface OrdersDashboardProps {
  fetchFn: (
    page: number,
    size: number
  ) => Promise<PaginatedResponse<OrderResponse>>;
  backHref?: string;
  emptyDescription: string;
  actions?: ReactNode;
}

export const OrdersDashboard = ({
  fetchFn,
  backHref,
  emptyDescription,
  actions,
}: OrdersDashboardProps) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchFn(currentPage, 10);

      setOrders(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível carregar seu histórico de pedidos.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <LoadingIndicator message="Carregando pedidos..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Histórico"
        highlightedTitle="Indisponível"
        errorMessage={errorMessage}
        onRetry={fetchOrders}
        backPath={backHref ?? ""}
        backLabel="VOLTAR"
      />
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="MEUS PEDIDOS"
        subtitle="Rastreio e gestão centralizada de transações"
        backPath={backHref}
        label="Histórico de Pedidos"
        actions={
          <div className="flex flex-col items-center gap-4 md:flex-row">
            {actions}

            <DashboardTotalBadge
              icon={Tag}
              value={totalElements}
              unit="Pedidos"
            />
          </div>
        }
      />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white py-32 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-200">
            <Package size={48} />
          </div>

          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
            Nenhum pedido encontrado.
          </h2>

          <p className="mt-4 max-w-xs text-xs font-bold uppercase tracking-widest text-slate-400 leading-relaxed">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};
