"use client";

import { UserAddressResponse } from "@/@types/address/user-address-response";

interface AddressContentCardProps {
  address: UserAddressResponse;
  isActive?: boolean;
}

export const AddressContentCard = ({
  address,
  isActive = false,
}: AddressContentCardProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest transition-colors ${
            isActive ? "bg-indigo-600 text-white" : "bg-slate-950 text-white"
          }`}
        >
          {address.label || "LOCAL_PADRAO"}
        </span>
      </div>

      <h4 className="text-sm font-black uppercase italic tracking-tighter text-slate-950">
        {address.street}, {address.number}
        {address.complement && (
          <span className="ml-2 text-indigo-600 not-italic">
            ({address.complement})
          </span>
        )}
      </h4>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>{address.neighborhood}</span>

        <span className="h-1 w-1 rounded-full bg-slate-200" />

        <span>
          {address.city}, {address.state}
        </span>

        <span className="h-1 w-1 rounded-full bg-slate-200" />

        <span className="font-mono text-indigo-400">{address.zip}</span>
      </div>
    </div>
  );
};
