"use client";

import { Plus, Store } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";

import { DashboardActiveProductsStatCard } from "@/components/dashboard-stats/dashboard-active-products-stat-card";
import { DashboardTotalRevenueStatCard } from "@/components/dashboard-stats/dashboard-total-revenue-stat-card";
import { DashboardUniqueCustomersStatCard } from "@/components/dashboard-stats/dashboard-unique-customers-stat-card";

import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { StoresList } from "@/components/stores-list";

import { useAnalytics } from "@/services/hooks/use-analytics";
import { useProduct } from "@/services/hooks/use-product";
import { useStore } from "@/services/hooks/use-store";
import { DashboardStatCard } from "@/components/dashboard-stat-card";

const DashboardPage = () => {
  const { getMyStores } = useStore();
  const { getUserActiveProductsCount } = useProduct();
  const { getUniqueCustomers, getTotalRevenue } = useAnalytics();

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [totalStores, setTotalStores] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getMyStores(0, 3);

      setStores(response.content);
      setTotalStores(response.totalElements);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Falha na sincronização dos dados do painel.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getMyStores]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <div className="mx-auto max-w-400 px-6 pt-40 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <DashboardPageHeader
            label="Painel de Controle"
            title="Olá, Subscriber"
            subtitle="Gerencie suas lojas e monitore o desempenho global."
            actions={
              <Link
                href="/dashboard/stores/new"
                className="flex items-center gap-3 rounded-2xl bg-slate-950 px-8 py-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 active:scale-95"
              >
                <Plus size={18} />
                Criar loja
              </Link>
            }
          />

          <section className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStatCard
              label="Quantidade de Lojas"
              value={totalStores.toString().padStart(2, "0")}
              icon={Store}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={fetchDashboardData}
            />

            <DashboardActiveProductsStatCard
              request={getUserActiveProductsCount}
            />

            <DashboardUniqueCustomersStatCard request={getUniqueCustomers} />

            <DashboardTotalRevenueStatCard request={getTotalRevenue} />
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
