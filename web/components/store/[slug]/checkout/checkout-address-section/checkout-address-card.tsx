"use client";

import { Check } from "lucide-react";

import { UserAddressResponse } from "@/@types/address/user-address-response";

interface AddressCardProps {
  address: UserAddressResponse;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CheckoutAddressCard = ({
  address,
  isSelected,
  onSelect,
}: AddressCardProps) => (
  <button
    onClick={() => onSelect(address.id)}
    className={`relative flex flex-col gap-1 rounded-2xl border-2 p-6 text-left transition-all ${
      isSelected
        ? "border-indigo-600 bg-indigo-50/30"
        : "border-slate-50 bg-slate-50 hover:border-slate-200"
    }`}
  >
    <div className="flex items-center justify-between">
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${
          isSelected ? "text-indigo-600" : "text-slate-400"
        }`}
      >
        {address.label}
      </span>

      {isSelected && <Check size={16} className="text-indigo-600" />}
    </div>

    <p className="mt-1 text-sm font-black text-slate-950 uppercase italic tracking-tighter">
      {address.street}, {address.number}
      {address.complement && (
        <span className="ml-1 text-slate-400">({address.complement})</span>
      )}
    </p>

    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {address.neighborhood}, {address.city} - {address.state} | {address.zip}
    </p>
  </button>
);
