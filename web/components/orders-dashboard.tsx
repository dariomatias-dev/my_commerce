"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Hash,
  Package,
  RefreshCcw,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderResponse } from "@/@types/order/order-response";
import { PaginatedResponse } from "@/@types/paginated-response";
import { LoadingIndicator } from "@/components/dashboard/loading-indicator";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Pagination } from "@/components/pagination";

interface OrdersDashboardProps {
  fetchFn: (
    page: number,
    size: number
  ) => Promise<PaginatedResponse<OrderResponse>>;
  backHref: string;
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

        <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-red-50 text-red-500">
            <AlertCircle size={40} />
          </div>

          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950">
            Falha ao <span className="text-red-500">carregar os pedidos</span>
          </h2>

          <button
            onClick={fetchOrders}
            className="mt-8 flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600"
          >
            <RefreshCcw size={14} />
            Tentar Novamente
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="grow bg-[#FBFBFC] pb-40 pt-35">
        <div className="mx-auto max-w-5xl px-6">
          <button
            onClick={() => router.push(backHref)}
            className="group mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Voltar
          </button>

          <div className="mb-16 flex flex-col items-start justify-between gap-6 border-b border-slate-100 pb-12 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1">
                <Package size={12} className="text-indigo-600" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
                  Histórico
                </span>
              </div>

              <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-950 md:text-7xl">
                {["Meus", "Pedidos"].map((word, i, arr) => (
                  <span
                    key={i}
                    className={i === arr.length - 1 ? "text-indigo-600" : ""}
                  >
                    {word}{" "}
                  </span>
                ))}
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
                  {totalElements} Ordens
                </p>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[4rem] border-2 border-dashed border-slate-200 bg-white py-32 text-center">
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
            <>
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <Link
                    href={`/orders/${order.id}`}
                    key={order.id}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 transition-all hover:border-indigo-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                      <div className="flex items-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-slate-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                          <ShoppingBag size={28} />
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Hash size={14} className="text-slate-300" />

                            <span className="text-sm font-black uppercase tracking-tighter text-slate-950">
                              ID: {order.id.split("-")[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-300" />
                            <span className="text-[10px] leading-none font-bold uppercase tracking-widest text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col items-end border-r border-slate-100 pr-6">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                            Itens
                          </span>

                          <span className="text-xl font-black text-slate-950">
                            {String(order.itemsCount || 0).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="rounded-full bg-emerald-50 px-5 py-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                            Processado
                          </span>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                          <ChevronRight size={24} />
                        </div>
                      </div>
                    </div>
                  </Link>
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
      </main>
      <Footer />
    </>
  );
};
