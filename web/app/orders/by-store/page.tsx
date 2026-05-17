"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { AlertCircle, Package, RefreshCcw, Store } from "lucide-react";

import { StoreResponse } from "@/@types/store/store-response";
import { DashboardTotalBadge } from "@/components/dashboard-total-badge";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { StoreCardInfo } from "@/components/store-card/store-card-info";
import { getMyOrderStores } from "@/services/orders";

const OrdersPage = () => {
  const router = useRouter();

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchStores() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMyOrderStores();

        if (!ignore) setStores(response.content || []);
      } catch {
        if (!ignore) setErrorMessage("Não foi possível carregar seu histórico de compras.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchStores();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  if (isLoading) {
    return <LoadingIndicator message="Carregando lojas..." />;
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 text-red-500 shadow-xl shadow-red-100/50">
          <AlertCircle size={40} />
        </div>

        <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
          Falha no <span className="text-red-500">Servidor</span>
        </h2>

        <p className="mt-4 max-w-xs text-center text-xs leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
          {errorMessage}
        </p>

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="mt-10 flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black tracking-[0.2em] text-white uppercase transition-all hover:bg-indigo-600 active:scale-95"
        >
          <RefreshCcw size={16} />
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="Meus Pedidos"
        subtitle="Selecione uma loja para gerenciar seu histórico"
        label="Dashboard de Compras"
        backPath="/orders"
        actions={<DashboardTotalBadge icon={Store} value={stores.length} unit="Lojas" />}
      />

      {stores.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => router.push(`by-store/${store.id}`)}
              className="group relative flex flex-col overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 text-left shadow-sm transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-slate-200/50 active:scale-[0.98]"
            >
              <StoreCardInfo store={store} basePath="/orders" />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white py-32 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-200">
            <Package size={48} />
          </div>

          <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
            Histórico Vazio.
          </h2>

          <p className="mt-4 max-w-xs text-xs leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
            Você ainda não realizou pedidos. Explore nossas lojas e comece agora.
          </p>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
