import { Package } from "lucide-react";

import { ProductResponse } from "@/@types/product/product-response";

interface InventoryItemProps {
  product: ProductResponse;
  threshold: number;
}

export const InventoryItem = ({ product, threshold }: InventoryItemProps) => {
  const percentage = Math.min((product.stock / threshold) * 100, 100);

  return (
    <li className="group flex items-center justify-between py-3.5 px-5 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-orange-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-500 group-hover:text-orange-400 group-hover:bg-orange-400/10 transition-colors">
          <Package size={16} />
        </div>

        <div className="flex flex-col">
          <span className="text-[13px] font-black tracking-tight text-slate-100 uppercase italic truncate max-w-40">
            {product.name}
          </span>
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            SKU: {product.slug.slice(0, 10).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-baseline gap-1">
          <span className="text-[13px] font-black text-orange-500 italic">
            {product.stock}
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase">
            un
          </span>
        </div>
        <div className="h-1 w-14 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </li>
  );
};
