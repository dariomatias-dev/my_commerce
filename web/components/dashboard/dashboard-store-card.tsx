"use client";

import { ArrowUpRight, Package, Settings, Trash2 } from "lucide-react";
import Link from "next/link";

interface DashboardStoreCardProps {
  store: {
    id: string;
    name: string;
    slug: string;
    status: string;
    products: number;
    revenue: string;
  };
  onDelete?: (id: string) => void;
}

export const DashboardStoreCard = ({
  store,
  onDelete,
}: DashboardStoreCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`flex h-2 w-2 rounded-full ${
                store.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />

            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                store.status === "ACTIVE"
                  ? "text-emerald-500"
                  : "text-slate-400"
              }`}
            >
              {store.status === "ACTIVE" ? "Loja Online" : "Loja Offline"}
            </span>
          </div>

          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950">
            {store.name}
          </h3>

          <p className="text-xs font-bold text-slate-400">/{store.slug}</p>
        </div>

        <Link
          href={`/dashboard/stores/${store.slug}`}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white transition-all hover:bg-indigo-600 active:scale-90"
        >
          <ArrowUpRight size={24} />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-50 pt-10">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Produtos
          </p>

          <p className="text-xl font-black text-slate-950">{store.products}</p>
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Faturamento
          </p>

          <p className="text-xl font-black text-slate-950">{store.revenue}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/stores/${store.slug}/products`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50"
        >
          <Package size={14} /> Produtos
        </Link>

        <Link
          href={`/dashboard/stores/${store.slug}/edit`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50"
        >
          <Settings size={14} /> Editar
        </Link>

        <button
          onClick={() => onDelete?.(store.id)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-50 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
