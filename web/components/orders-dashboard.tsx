"use client";

import { ArrowLeft, Package, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderResponse } from "@/@types/order/order-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { ErrorFeedback } from "@/components/error-feedback";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { OrderCard } from "./orders/order-card";

interface OrdersDashboardProps {
  fetchFn: (
    page: number,
    size: number
  ) => Promise<PaginatedResponse<OrderResponse>>;
  backHref?: string;
  emptyDescription: string;
}

export const OrdersDashboard = ({
  fetchFn,
  backHref,
  emptyDescription,
}: OrdersDashboardProps) => {
  const router = useRouter();
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
    return (
      <>
        <Header />
        <LoadingIndicator message="Carregando pedidos..." />
        <Footer />
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <Header />

        <ErrorFeedback
          title="Histórico"
          highlightedTitle="Indisponível"
          errorMessage={errorMessage}
          onRetry={fetchOrders}
          backPath={backHref ?? ""}
          backLabel="VOLTAR"
        />

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
        <button
          onClick={() => router.push(backHref ?? "")}
          className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Voltar
        </button>

        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
                ORDER_HISTORY
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
                Rastreio e gestão de transações
              </span>
            </div>

            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
              MEUS <span className="text-indigo-600">PEDIDOS.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Tag size={20} />
            </div>

            <div className="pr-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Total Localizado
              </p>
              <p className="text-lg font-black text-slate-950">
                {String(totalElements).padStart(2, "0")} Ordens
              </p>
            </div>
          </div>
        </div>

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
      </main>

      <Footer />
    </>
  );
};
