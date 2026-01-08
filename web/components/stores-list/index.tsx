"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { StoreCard } from "@/components/stores-list/dashboard-store-card";
import { useStore } from "@/services/hooks/use-store";
import { LoadingIndicator } from "../loading-indicator";

interface StoresListProps {
  stores: StoreResponse[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}

export const StoresList = ({
  stores,
  isLoading,
  errorMessage,
  onRetry,
}: StoresListProps) => {
  const { deleteStore } = useStore();

  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setActionError(null);

    try {
      await deleteStore(id);
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message);
      } else {
        setActionError("Não foi possível remover a loja selecionada.");
      }

      setTimeout(() => setActionError(null), 5000);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Obtendo lojas..." />;
  }

  if (errorMessage) {
    return (
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
          onClick={onRetry}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600"
        >
          <RefreshCcw size={16} /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {actionError && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="text-red-500 shrink-0" size={18} />

          <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
            {actionError}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};
