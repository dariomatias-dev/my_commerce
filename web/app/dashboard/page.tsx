"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Plus, Store } from "lucide-react";

import { StoreResponse } from "@/@types/store/store-response";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { DashboardActiveProductsStatCard } from "@/components/dashboard-stats/dashboard-active-products-stat-card";
import { DashboardTotalRevenueStatCard } from "@/components/dashboard-stats/dashboard-total-revenue-stat-card";
import { DashboardUniqueCustomersStatCard } from "@/components/dashboard-stats/dashboard-unique-customers-stat-card";
import { ErrorFeedback } from "@/components/error-feedback";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { StoresList } from "@/components/stores-list";
import { getMyTotalRevenue, getUniqueCustomers } from "@/services/analytics";
import { getUserActiveProductsCount } from "@/services/products";
import { getMyStores } from "@/services/stores";

const DashboardPage = () => {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [totalStores, setTotalStores] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchDashboardData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMyStores(0, 3);

        if (!ignore) {
          setStores(response.content);
          setTotalStores(response.totalElements);
        }
      } catch {
        if (!ignore) setErrorMessage("Falha na sincronização dos dados do painel.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  if (isLoading) {
    return <LoadingIndicator message="Carregando dados..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Painel"
        highlightedTitle="Indisponível"
        errorMessage={errorMessage}
        onRetry={() => setRefreshKey((k) => k + 1)}
        backPath="/dashboard"
        backLabel="VOLTAR AO INÍCIO"
      />
    );
  }

  return (
    <>
      <DashboardPageHeader
        label="Painel de Controle"
        title="Olá, Subscriber"
        subtitle="Gerencie suas lojas e monitore o desempenho global."
        actions={
          <Link
            href="/dashboard/stores/new"
            className="flex items-center gap-3 rounded-2xl bg-slate-950 px-8 py-5 text-[11px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 active:scale-95"
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
          onRetry={() => setRefreshKey((k) => k + 1)}
        />

        <DashboardActiveProductsStatCard request={getUserActiveProductsCount} />

        <DashboardUniqueCustomersStatCard request={getUniqueCustomers} />

        <DashboardTotalRevenueStatCard request={getMyTotalRevenue} />
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-indigo-600" />
            <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
              Minhas <span className="text-indigo-600">Lojas</span>
            </h2>
          </div>

          <Link
            href="/dashboard/stores"
            className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
          >
            Ver todas as lojas
          </Link>
        </div>

        <StoresList
          stores={stores}
          basePath="/dashboard"
          onRetry={() => setRefreshKey((k) => k + 1)}
        />
      </section>
    </>
  );
};

export default DashboardPage;
