"use client";

import {
  AlertCircle,
  ArrowRight,
  LayoutGrid,
  RefreshCcw,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { StoreCardInfo } from "@/components/store-card/store-card-info";
import { useOrder } from "@/services/hooks/use-order";

const OrdersPage = () => {
  const router = useRouter();

  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getMyOrderStores } = useOrder();

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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="h-24 w-24 animate-[spin_2s_linear_infinite] rounded-[2.5rem] border-[3px] border-slate-100 border-t-indigo-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-slate-900 animate-pulse" />
          </div>
        </div>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
          Sincronizando
        </p>
      </div>
    );
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
    <main className="grow pt-35 pb-40 bg-[#FBFBFC]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 flex flex-col items-center justify-between gap-8 border-b border-slate-100 pb-12 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
              <LayoutGrid size={12} />
              Dashboard de Compras
            </div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-950 md:text-8xl">
              Meus <span className="text-indigo-600">Pedidos.</span>
            </h1>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Selecione uma loja para gerenciar seu histórico
            </p>
          </div>

          <div className="flex h-16 items-center gap-4 rounded-3xl bg-white px-6 shadow-sm border border-slate-100">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Total de lojas
              </p>
              <p className="text-xl font-black text-slate-950">
                {stores.length}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Store size={20} />
            </div>
          </div>
        </div>

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
          <div className="flex flex-col items-center justify-center rounded-[5rem] border-2 border-dashed border-slate-200 bg-white py-40 text-center">
            <div className="relative mb-10 h-32 w-32">
              <div className="absolute inset-0 animate-ping rounded-full bg-indigo-50 opacity-40" />
              <div className="relative flex h-full w-full items-center justify-center rounded-[3.5rem] bg-slate-50 text-slate-200">
                <ShoppingBag size={60} />
              </div>
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
              Histórico <span className="text-slate-400">Vazio.</span>
            </h2>
            <p className="mt-6 max-w-sm text-xs font-bold uppercase tracking-[0.2em] text-slate-400 leading-relaxed">
              Você ainda não realizou pedidos. Explore nossas lojas e comece
              agora.
            </p>
            <button
              onClick={() => router.push("/")}
              className="group mt-12 flex items-center gap-4 rounded-2xl bg-slate-950 px-14 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95"
            >
              Explorar Ecossistema
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-2"
              />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
