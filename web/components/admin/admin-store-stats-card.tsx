"use client";

import { AlertCircle, ArrowUpRight, Loader2, Store } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useStore } from "@/services/hooks/use-store";

export const AdminStoreStatsCard = () => {
  const { getTotalActiveStores, getNewActiveStoresThisMonth } = useStore();

  const [data, setData] = useState({ total: 0, trend: "0%" });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [totalActive, newActive] = await Promise.all([
        getTotalActiveStores(),
        getNewActiveStoresThisMonth(),
      ]);

      const previousTotal = totalActive - newActive;
      const percentage =
        previousTotal > 0
          ? ((newActive / previousTotal) * 100).toFixed(1)
          : newActive > 0
          ? "100"
          : "0";

      setData({
        total: totalActive,
        trend: `+${percentage}%`,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar métricas de lojas.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getTotalActiveStores, getNewActiveStoresThisMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex min-h-47 flex-col items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
        <Loader2 className="mb-2 animate-spin text-indigo-600" size={24} />

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Sincronizando
        </span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-47 flex-col items-center justify-center rounded-[2.5rem] border border-red-100 bg-red-50 p-8 shadow-sm">
        <AlertCircle className="mb-2 text-red-500" size={20} />

        <p className="mb-3 px-4 text-center text-[9px] font-black uppercase leading-tight text-red-600">
          {errorMessage}
        </p>

        <button
          onClick={fetchData}
          className="rounded-full bg-red-600 px-4 py-2 text-[8px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
        >
          Repetir
        </button>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-950 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <Store size={24} />
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-600">
          <ArrowUpRight size={10} /> {data.trend}
        </div>
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Lojas Ativas
      </p>

      <p className="mt-1 text-4xl font-black tracking-tighter text-slate-950">
        {data.total.toLocaleString()}
      </p>
    </div>
  );
};
