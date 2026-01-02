import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

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

export const StoreCartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: StoreCartItemProps) => (
  <div className="group flex gap-4">
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
      <Image
        src={item.image}
        alt={item.name}
        fill
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    <div className="flex flex-1 flex-col justify-between py-0.5">
      <div>
        <h4 className="text-sm font-black uppercase italic leading-tight text-slate-950">
          {item.name}
        </h4>
        <p className="text-sm font-black text-indigo-600 mt-0.5">
          {item.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-slate-100 p-0.5 bg-white">
          <button
            onClick={() => onDecrease(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-30"
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </button>

          <span className="w-7 text-center text-xs font-black text-slate-950">
            {item.quantity}
          </span>

          <button
            onClick={() => onIncrease(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-50 text-slate-500 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);
