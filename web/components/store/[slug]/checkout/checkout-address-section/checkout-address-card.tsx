"use client";

import { Check } from "lucide-react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { AddressContentCard } from "@/components/address-content-card";

interface CheckoutAddressCardProps {
  address: UserAddressResponse;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CheckoutAddressCard = ({
  address,
  isSelected,
  onSelect,
}: CheckoutAddressCardProps) => (
  <button
    onClick={() => onSelect(address.id)}
    className={`relative flex flex-col gap-1 rounded-2xl border-2 p-6 text-left transition-all ${
      isSelected
        ? "border-indigo-600 bg-indigo-50/30"
        : "border-slate-50 bg-slate-50 hover:border-slate-200"
    }`}
  >
    <AddressContentCard address={address} isActive={isSelected} />

    <div className="absolute right-6 top-6">
      {isSelected && <Check size={16} className="text-indigo-600" />}
    </div>
  </button>
);
