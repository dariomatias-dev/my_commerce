import { Package, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { StoreCardProps } from ".";

export const StoreCardActions = ({ store, onDelete }: StoreCardProps) => {
  return (
    <div className="mt-10 flex items-center gap-3">
      <Link
        href={`stores/${store.slug}/products`}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50"
      >
        <Package size={14} /> Produtos
      </Link>

      <Link
        href={`stores/${store.slug}/edit`}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 text-slate-400 transition-colors hover:bg-slate-50 hover:text-indigo-600"
      >
        <Pencil size={16} />
      </Link>

      <button
        onClick={() => onDelete?.(store.id)}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-50 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
