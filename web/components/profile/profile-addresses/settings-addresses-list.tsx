"use client";

import { AlertCircle, Globe, RefreshCw } from "lucide-react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { SettingsAddressCard } from "./settings-address-card";

interface SettingsAddressesListProps {
  addresses: UserAddressResponse[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

export const SettingsAddressesList = ({
  addresses,
  isLoading,
  error,
  onDelete,
  onRetry,
}: SettingsAddressesListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <RefreshCw
            className="absolute h-12 w-12 animate-spin text-indigo-100"
            strokeWidth={1}
          />
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
        </div>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
          Sincronizando clusters de dados...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-red-50 bg-red-50/20 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle size={24} />
        </div>

        <div>
          <h4 className="text-sm font-black uppercase italic tracking-tighter text-red-600">
            Falha na Comunicação
          </h4>
          <p className="text-[10px] font-bold uppercase text-red-400 tracking-widest mt-1">
            {error}
          </p>
        </div>

        <button
          onClick={onRetry}
          className="rounded-xl bg-red-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-red-700 active:scale-95"
        >
          Tentar Reconexão
        </button>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/30 p-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-200 shadow-sm">
          <Globe size={28} />
        </div>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic max-w-50 leading-relaxed">
          Nenhuma instância de localização mapeada nesta conta.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {addresses.map((addr) => (
        <SettingsAddressCard key={addr.id} addr={addr} onDelete={onDelete} />
      ))}
    </div>
  );
};
