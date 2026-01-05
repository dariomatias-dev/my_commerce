"use client";

import { MapPin, Trash2 } from "lucide-react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { AddressContentCard } from "@/components/address-content-card";

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

        <AddressContentCard address={addr} />
      </div>

      <button
        onClick={() => onDelete(addr.id)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 transition-all hover:bg-red-50 hover:text-red-500 active:scale-90"
      >
        <Trash2 size={18} />
      </button>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-600 transition-all duration-500 group-hover:w-full opacity-20" />
    </div>
  );
};
