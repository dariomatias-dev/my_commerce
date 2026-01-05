"use client";

import { MapPin, Trash2 } from "lucide-react";

import { UserAddressResponse } from "@/@types/address/user-address-response";

interface ProfileAddressCardProps {
  addr: UserAddressResponse;
  onDelete: (id: string) => void;
}

export const ProfileAddressCard = ({
  addr,
  onDelete,
}: ProfileAddressCardProps) => {
  return (
    <div className="group relative flex items-center justify-between overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-5 transition-all hover:border-indigo-600/20 hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="flex items-start gap-5">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <MapPin size={24} />
          <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-white">
              {addr.label || "IDENTIFICADOR_NULO"}
            </span>
          </div>

          <h4 className="text-sm font-black uppercase italic tracking-tighter text-slate-950">
            {addr.street}, {addr.number}
            {addr.complement && (
              <span className="ml-2 text-indigo-600 not-italic">
                [{addr.complement}]
              </span>
            )}
          </h4>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1">{addr.neighborhood}</span>
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <span>
              {addr.city}, {addr.state}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-200" />
            <span className="font-mono text-indigo-400">{addr.zip}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center pl-4">
        <button
          onClick={() => onDelete(addr.id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-300 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 active:scale-90"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-600 transition-all duration-500 group-hover:w-full opacity-20" />
    </div>
  );
};
