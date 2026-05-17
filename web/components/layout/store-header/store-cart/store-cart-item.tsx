import { Minus, Plus, Trash2 } from "lucide-react";

import { ProductImage } from "@/components/product-image";

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreCartItemProps {
  item: Item;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export const StoreCartItem = ({ item, onIncrease, onDecrease, onRemove }: StoreCartItemProps) => (
  <div className="group flex gap-4">
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
      <ProductImage
        imagePath={item.image}
        alt={item.name}
        className="transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    <div className="flex flex-1 flex-col justify-between py-0.5">
      <div>
        <h4 className="text-sm leading-tight font-black text-slate-950 uppercase italic">
          {item.name}
        </h4>
        <p className="mt-0.5 text-sm font-black text-indigo-600">
          {item.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-slate-100 bg-white p-0.5">
          <button
            onClick={() => onDecrease(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30"
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </button>

          <span className="w-7 text-center text-xs font-black text-slate-950">{item.quantity}</span>

          <button
            onClick={() => onIncrease(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-50"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);
