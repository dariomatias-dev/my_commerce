"use client";

import { AlertCircle, Loader2, PackageSearch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useProduct } from "@/services/hooks/use-product";

interface ActiveProductsStatCardProps {
  storeId: string;
  isActive: boolean;
}

export const ActiveProductsStatCard = ({
  storeId,
  isActive,
}: ActiveProductsStatCardProps) => {
  const { getActiveProductsCount } = useProduct();

  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getActiveProductsCount(storeId);
      setCount(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro de estoque");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getActiveProductsCount, storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex min-h-37 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6">
        <Loader2 className="animate-spin text-indigo-600" size={18} />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-37 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <AlertCircle className="mb-1 text-red-500" size={18} />
        <p className="text-[8px] font-black uppercase tracking-widest text-red-600">
          {errorMessage}
        </p>
        <button
          onClick={fetchData}
          className="mt-2 text-[8px] font-bold uppercase underline text-red-700"
        >
          Repetir
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-slate-50 p-2 text-indigo-600">
          <PackageSearch size={18} />
        </div>
        <div
          className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${
            isActive ? "animate-pulse" : "opacity-20"
          }`}
        />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Produtos Ativos
      </p>
      <h3 className="mt-1 text-2xl font-black italic tracking-tighter text-slate-950">
        {count.toLocaleString()}
      </h3>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-tight text-slate-400">
        Itens disponíveis na loja
      </p>
    </div>
  );
};
