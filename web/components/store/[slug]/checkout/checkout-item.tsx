import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

import { Item } from "../store-header/store-cart/store-cart-item";

interface CheckoutItemProps {
  item: Item;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CheckoutItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CheckoutItemProps) => (
  <div className="flex items-center gap-4 group">
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
      <Image
        src={item.image}
        alt={item.name}
        unoptimized
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    <div className="flex-1 flex flex-col gap-1">
      <h4 className="text-[11px] font-black uppercase italic leading-tight text-slate-950 line-clamp-1">
        {item.name}
      </h4>

      <p className="text-xs font-black text-indigo-600">
        {item.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>

      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center gap-1 rounded-lg border border-slate-100 p-0.5 bg-white">
          <button
            onClick={() => onDecrease(item.id)}
            disabled={item.quantity <= 1}
            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-30"
          >
            <Minus size={12} />
          </button>

          <span className="w-6 text-center text-[10px] font-black text-slate-950">
            {item.quantity}
          </span>

          <button
            onClick={() => onIncrease(item.id)}
            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-slate-50 text-slate-500 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-slate-300 hover:text-red-500 transition-colors"
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
