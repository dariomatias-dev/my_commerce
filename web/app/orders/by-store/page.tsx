"use client";

import { AlertCircle, Package, RefreshCcw, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { DashboardTotalBadge } from "@/components/dashboard-total-badge";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { StoreCardInfo } from "@/components/store-card/store-card-info";
import { useOrder } from "@/services/hooks/use-order";

const OrdersPage = () => {
  const router = useRouter();

  const { getMyOrderStores } = useOrder();

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getMyOrderStores();

      setStores(response.content || []);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível carregar seu histórico de compras.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getMyOrderStores]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  if (isLoading) {
    return <LoadingIndicator message="Carregando lojas..." />;
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 text-red-500 shadow-xl shadow-red-100/50">
          <AlertCircle size={40} />
        </div>

        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
          Falha no <span className="text-red-500">Servidor</span>
        </h2>

        <p className="mt-4 max-w-xs text-center text-xs font-bold uppercase tracking-widest text-slate-400 leading-relaxed">
          {errorMessage}
        </p>

        <button
          onClick={fetchStores}
          className="mt-10 flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-indigo-600 active:scale-95"
        >
          <RefreshCcw size={16} />
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
      <DashboardPageHeader
        title="Meus Pedidos"
        subtitle="Selecione uma loja para gerenciar seu histórico"
        label="Dashboard de Compras"
        actions={
          <DashboardTotalBadge
            icon={Store}
            value={stores.length}
            unit="Lojas"
          />
        }
      />

      {stores.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => router.push(`by-store/${store.id}`)}
              className="group relative flex flex-col overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 text-left shadow-sm transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-slate-200/50 active:scale-[0.98]"
            >
              <StoreCardInfo store={store} />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white py-32 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-slate-200">
            <Package size={48} />
          </div>

          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
            Histórico Vazio.
          </h2>

          <p className="mt-4 max-w-xs text-xs font-bold uppercase tracking-widest text-slate-400 leading-relaxed">
            Você ainda não realizou pedidos. Explore nossas lojas e comece
            agora.
          </p>
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
