import { Minus, Plus, Trash2 } from "lucide-react";

import { ProductImage } from "@/components/product-image";

import { Item } from "../../../../layout/store-header/store-cart/store-cart-item";

interface CheckoutItemProps {
  item: Item;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CheckoutItem = ({ item, onIncrease, onDecrease, onRemove }: CheckoutItemProps) => (
  <div className="group flex items-center gap-4">
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
      <ProductImage
        imagePath={item.image}
        alt={item.name}
        fill
        className="object-fill transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    <div className="flex flex-1 flex-col gap-1">
      <h4 className="line-clamp-1 text-[11px] leading-tight font-black text-slate-950 uppercase italic">
        {item.name}
      </h4>

      <p className="text-xs font-black text-indigo-600">
        {item.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-100 bg-white p-0.5">
          <button
            onClick={() => onDecrease(item.id)}
            disabled={item.quantity <= 1}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30"
          >
            <Minus size={12} />
          </button>

          <span className="w-6 text-center text-[10px] font-black text-slate-950">
            {item.quantity}
          </span>

          <button
            onClick={() => onIncrease(item.id)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-50"
          >
            <Plus size={12} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-slate-300 transition-colors hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    <div className="text-right">
      <p className="text-xs font-black text-slate-950">
        {(item.price * item.quantity).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </div>
  </div>
);
