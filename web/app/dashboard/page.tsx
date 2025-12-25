"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { StoreCard } from "@/components/dashboard/dashboard-store-card";
import { useAuthContext } from "@/contexts/auth-context";
import { useStore } from "@/services/hooks/use-store";

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
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível carregar suas instâncias operacionais.");
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
        <div className="mb-16 border-b border-slate-200 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase">
              <Zap size={14} fill="currentColor" />
              Infraestrutura de Lojas
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              MINHAS <span className="text-indigo-600">LOJAS.</span>
            </h1>
            <p className="mt-4 text-sm font-bold text-slate-400 uppercase italic">
              Página {currentPage + 1} de {totalPages || 1} — Console
              Administrativo Global.
            </p>
          </div>

          <Link
            href="/dashboard/store/new"
            className="group flex items-center gap-4 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95"
          >
            <Plus size={20} />
            CRIAR LOJA
          </Link>
        </div>

        {isLoading ? (
          <div className="flex min-h-100 flex-col items-center justify-center gap-8">
            <Loader2 className="h-14 w-14 animate-spin text-indigo-600" />
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">
              Mapeando Nodes...
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-100 flex-col items-center justify-center gap-8 rounded-[3rem] border border-red-100 bg-red-50/30 p-16 text-center">
            <AlertCircle size={64} className="text-red-500" />
            <div className="max-w-xl space-y-4">
              <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
                Erro Crítico de Rede.
              </h2>
              <p className="text-lg font-medium text-slate-500 italic leading-relaxed">
                {error}
              </p>
            </div>
            <button
              onClick={fetchStores}
              className="flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 shadow-xl"
            >
              <RefreshCw size={20} /> RECONECTAR PROTOCOLO
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-20 shadow-sm"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex items-center gap-3">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`h-14 w-14 rounded-2xl text-[11px] font-black transition-all ${
                        currentPage === i
                          ? "bg-slate-950 text-white shadow-2xl scale-110"
                          : "bg-white border border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-20 shadow-sm"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
