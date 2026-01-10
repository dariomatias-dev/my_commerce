"use client";

import { ArrowUpRight, Package, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { StoreResponse } from "@/@types/store/store-response";

interface StoreCardProps {
  store: StoreResponse;
  onDelete?: (id: string) => void;
}

export const StoreCard = ({ store, onDelete }: StoreCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`flex h-2 w-2 rounded-full ${
                  store.isActive ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />

              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  store.isActive ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                {store.isActive ? "Loja Online" : "Loja Offline"}
              </span>
            </div>

            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950">
              {store.name}
            </h3>

            <p className="text-xs font-bold text-slate-400">/{store.slug}</p>
          </div>

          <Link
            href={`stores/${store.slug}`}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white transition-all hover:bg-indigo-600 active:scale-90"
          >
            <ArrowUpRight size={24} />
          </Link>
        </div>
      </div>

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
    </div>
  );
};
