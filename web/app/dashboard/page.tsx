"use client";

import {
  Activity,
  AlertCircle,
  Loader2,
  Package,
  Plus,
  RefreshCcw,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { DashboardStoreCard } from "@/components/dashboard/dashboard-store-card";
import { useStore } from "@/services/hooks/use-store";

const DashboardPage = () => {
  const { getMyStores, deleteStore } = useStore();

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const stats = [
    { label: "Total em Lojas", value: "04", icon: Store },
    { label: "Produtos Ativos", value: "128", icon: Package },
    { label: "Clientes Totais", value: "1.2k", icon: Users },
    { label: "Taxa de Conversão", value: "3.2%", icon: Activity },
  ];

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await getMyStores(0, 3);
      setStores(response.content);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Falha na sincronização das lojas."
      );
    } finally {
      setIsLoading(false);
    }
  }, [getMyStores]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleDeleteStore = async (id: string) => {
    setActionError(null);
    try {
      await deleteStore(id);
      setStores((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      setActionError(
        error instanceof ApiError
          ? error.message
          : "Não foi possível remover a loja selecionada."
      );

      setTimeout(() => setActionError(null), 5000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <div className="mx-auto max-w-400 px-6 pt-40 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
                Painel de Controle
              </span>

              <h1 className="mt-2 text-5xl font-black uppercase italic tracking-tighter text-slate-950 lg:text-6xl">
                Olá, <span className="text-indigo-600">Subscriber</span>
              </h1>

              <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-tight">
                Gerencie suas lojas e monitore o desempenho global.
              </p>
            </div>

            <Link
              href="/dashboard/stores/new"
              className="flex items-center gap-3 rounded-2xl bg-slate-950 px-8 py-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 active:scale-95"
            >
              <Plus size={18} />
              Nova Loja
            </Link>
          </header>

          <section className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <DashboardStatCard
                key={index}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                isActive={true}
              />
            ))}
          </section>

          <section>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-indigo-600" />

                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
                  Minhas <span className="text-indigo-600">Lojas</span>
                </h2>
              </div>

              <Link
                href="/dashboard/stores"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
              >
                Ver todas as lojas
              </Link>
            </div>

            {actionError && (
              <div className="mb-8 flex items-center gap-3 rounded-2xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
                  {actionError}
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <Loader2
                  className="animate-spin text-indigo-600 mb-4"
                  size={40}
                />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Sincronizando Instâncias
                </p>
              </div>
            ) : errorMessage ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-red-100 text-center px-6">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-red-50 text-red-500">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                  Falha na <span className="text-red-500">Conexão</span>
                </h3>
                <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-tight max-w-xs">
                  {errorMessage}
                </p>
                <button
                  onClick={fetchStores}
                  className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600"
                >
                  <RefreshCcw size={16} /> Tentar Novamente
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {stores.map((store) => (
                  <DashboardStoreCard
                    key={store.id}
                    store={store}
                    onDelete={handleDeleteStore}
                  />
                ))}

                <Link
                  href="/dashboard/stores/new"
                  className="flex min-h-85 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm transition-transform">
                    <Plus size={32} />
                  </div>

                  <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Registrar nova loja
                  </p>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
