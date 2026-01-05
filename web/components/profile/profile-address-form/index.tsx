"use client";

import { MapPin, Navigation, Trash2 } from "lucide-react";
import { useState } from "react";

import { AddressAddForm, AddressFormValues } from "./profile-address-add-form";

export const ProfileAddressForm = () => {
  const [addresses, setAddresses] = useState<AddressFormValues[]>([
    {
      neighborhood: "",
      complement: "",
      street: "Av. Paulista",
      number: "1000",
      city: "São Paulo",
      state: "SP",
      cep: "01310-100",
      latitude: "-23.5614",
      longitude: "-46.6558",
    },
  ]);

  const handleAddAddress = (newAddress: AddressFormValues) => {
    setAddresses((prev) => [
      ...prev,
      { ...newAddress, id: Math.random().toString() },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-50 pb-4">
        <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
          Meus Endereços
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Gestão de Logística e Localização
        </p>
      </div>

      <div className="grid gap-3">
        {addresses.map((addr) => (
          <div
            key={addr.latitude}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <MapPin size={16} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-950 uppercase">
                  {addr.street}, {addr.number}
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                    {addr.city} - {addr.state}
                  </p>
                  {addr.latitude && (
                    <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase">
                      <Navigation size={8} /> GPS_LINKED
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => {}}
              className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <AddressAddForm onAdd={handleAddAddress} />
    </div>
  );
};
