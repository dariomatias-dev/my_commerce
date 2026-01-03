import { Check } from "lucide-react";

interface Address {
  id: string;
  label: string;
  street: string;
  neighborhood: string;
  city: string;
  zip: string;
}

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "1",
    label: "Casa",
    street: "Rua das Flores, 123",
    neighborhood: "Jardim Paulista",
    city: "São Paulo - SP",
    zip: "01234-567",
  },
  {
    id: "2",
    label: "Trabalho",
    street: "Av. Paulista, 1000 - Sala 42",
    neighborhood: "Bela Vista",
    city: "São Paulo - SP",
    zip: "01310-100",
  },
];

interface AddressCardProps {
  address: Address;
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

    <p className="mt-1 text-sm font-black text-slate-950">{address.street}</p>

    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
      {address.neighborhood}, {address.city} - {address.zip}
    </p>
  </button>
);
