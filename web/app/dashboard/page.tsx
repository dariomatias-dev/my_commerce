"use client";

import { Activity, Package, Plus, Store, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { StoresList } from "@/components/stores-list";
import { useProduct } from "@/services/hooks/use-product";
import { useStore } from "@/services/hooks/use-store";

const DashboardPage = () => {
  const { getMyStores } = useStore();
  const { getUserActiveProductsCount } = useProduct();

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [totalStores, setTotalStores] = useState(0);
  const [totalActiveProducts, setTotalActiveProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stats = [
    {
      label: "Total em Lojas",
      value: totalStores.toString().padStart(2, "0"),
      icon: Store,
    },
    {
      label: "Produtos Ativos",
      value: totalActiveProducts.toString().padStart(2, "0"),
      icon: Package,
    },
    { label: "Clientes Totais", value: "1.2k", icon: Users },
    { label: "Taxa de Conversão", value: "3.2%", icon: Activity },
  ];

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [storesResponse, activeProductsCount] = await Promise.all([
        getMyStores(0, 3),
        getUserActiveProductsCount(),
      ]);

      setStores(storesResponse.content);
      setTotalStores(storesResponse.totalElements);
      setTotalActiveProducts(activeProductsCount);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Falha na sincronização dos dados do painel.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getMyStores, getUserActiveProductsCount]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <div className="mx-auto max-w-400 px-6 pt-40 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
              Criar loja
            </Link>
          </section>

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

            <StoresList
              stores={stores}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={fetchDashboardData}
            />
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
