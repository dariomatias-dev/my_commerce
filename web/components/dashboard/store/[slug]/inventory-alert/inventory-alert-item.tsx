import { ProductResponse } from "@/@types/product/product-response";
import { ProductImage } from "@/components/product-image";

interface InventoryItemProps {
  product: ProductResponse;
  threshold: number;
}

export const InventoryItem = ({ product, threshold }: InventoryItemProps) => {
  const percentage = Math.min((product.stock / threshold) * 100, 100);

  return (
    <li className="group flex items-center justify-between rounded-2xl border border-slate-800/50 bg-slate-900/50 px-5 py-3.5 transition-all duration-300 hover:border-orange-500/40">
      <div className="flex items-center gap-4">
        <ProductImage
          imagePath={product.images?.[0]?.url}
          alt={product.name}
          size={36}
          className="rounded-lg bg-slate-800 text-slate-500 transition-colors group-hover:bg-orange-400/10 group-hover:text-orange-400"
        />

        <div className="flex flex-col">
          <span className="max-w-40 truncate text-[13px] font-black tracking-tight text-slate-100 uppercase italic">
            {product.name}
          </span>
          <span className="text-[9px] font-bold tracking-widest text-slate-600">
            {product.slug}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-baseline gap-1">
          <span className="text-[13px] font-black text-orange-500 italic">{product.stock}</span>
          <span className="text-[8px] font-bold text-slate-500 uppercase">un</span>
        </div>
        <div className="h-1 w-14 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </li>
  );
};
