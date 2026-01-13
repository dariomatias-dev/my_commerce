import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { StoreResponse } from "@/@types/store/store-response";

interface StoreCardInfoProps {
  store: StoreResponse;
}

export const StoreCardInfo = ({ store }: StoreCardInfoProps) => {
  return (
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
            {store.isActive ? "Loja Online" : "Loja Removida"}
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
  );
};
