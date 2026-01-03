import { MapPin, Plus } from "lucide-react";

import { CheckoutAddressCard, MOCK_ADDRESSES } from "./checkout-address-card";

interface CheckoutAddressSectionProps {
  selectedAddressId: string;
  onSelect: (id: string) => void;
}

export const CheckoutAddressSection = ({
  selectedAddressId,
  onSelect,
}: CheckoutAddressSectionProps) => {
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
              Escolha um endereço salvo
            </p>
          </div>
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_ADDRESSES.map((address) => (
          <CheckoutAddressCard
            key={address.id}
            address={address}
            isSelected={selectedAddressId === address.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
};
