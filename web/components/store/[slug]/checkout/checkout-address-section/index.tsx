"use client";

import { MapPin, Plus, X } from "lucide-react";
import { useState } from "react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { SettingsAddressAddForm } from "@/components/profile/profile-addresses/settings-address-add-form";
import { ProfileAddressFormValues } from "@/schemas/profile-address.schema";
import { CheckoutAddressCard } from "./checkout-address-card";

interface CheckoutAddressSectionProps {
  addresses: UserAddressResponse[];
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
  onAddAddress: (data: ProfileAddressFormValues) => Promise<void>;
}

export const CheckoutAddressSection = ({
  addresses,
  selectedAddressId,
  onSelect,
  onAddAddress,
}: CheckoutAddressSectionProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddNewAddress = async (formData: ProfileAddressFormValues) => {
    try {
      await onAddAddress(formData);

      setIsAddingNew(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <section className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 md:p-10 transition-all hover:border-indigo-100">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <MapPin size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
              Onde <span className="text-indigo-600">Entregar?</span>
            </h2>

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {isAddingNew
                ? "Cadastrar novo endereço"
                : "Escolha um endereço salvo"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
            isAddingNew
              ? "bg-red-50 text-red-500 rotate-0"
              : "bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white"
          }`}
        >
          {isAddingNew ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {isAddingNew ? (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <SettingsAddressAddForm onAdd={handleAddNewAddress} />
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 p-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-4">
                Nenhum endereço cadastrado.
              </p>

              <button
                onClick={() => setIsAddingNew(true)}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline"
              >
                + Adicionar meu primeiro endereço
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((address) => (
                <CheckoutAddressCard
                  key={address.id}
                  address={address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};
