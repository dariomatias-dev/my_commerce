"use client";

import {
  AlertCircle,
  MapPin,
  Navigation,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { UserAddressResponse } from "@/@types/address/user-address-response";

interface ProfileAddressesListProps {
  addresses: UserAddressResponse[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

export const ProfileAddressesList = ({
  addresses,
  isLoading,
  error,
  onDelete,
  onRetry,
}: ProfileAddressesListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Sincronizando com o servidor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
        <AlertCircle className="text-red-500" size={18} />

        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">
          {error}
        </p>

        <button
          onClick={onRetry}
          className="ml-auto text-[10px] font-black text-red-600 underline uppercase"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
          Nenhum endereço cadastrado na sua conta.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <MapPin size={16} />
            </div>

            <div>
              <h4 className="text-[11px] font-black text-slate-950 uppercase">
                {addr.street}, {addr.number}{" "}
                {addr.complement && `(${addr.complement})`}
              </h4>

              <div className="flex items-center gap-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  {addr.city} - {addr.state} | {addr.zip}
                </p>

                {(addr.latitude !== 0 || addr.longitude !== 0) && (
                  <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase">
                    <Navigation size={8} /> GPS_LINKED
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete(addr.id)}
            className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
