import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { StoreResponse } from "@/@types/store/store-response";

interface StoreCardInfoProps {
  store: StoreResponse;
  basePath: string;
}

export const StoreCardInfo = ({ store, basePath }: StoreCardInfoProps) => {
  const isRemoved = store.deletedAt !== null;
  const isActive = store.isActive && !isRemoved;
  const statusText = isRemoved ? "Loja Removida" : isActive ? "Loja Online" : "Loja Desativada";
  const statusColor = isRemoved ? "slate-400" : isActive ? "emerald-500" : "yellow-500";

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className={`flex h-2 w-2 rounded-full bg-${statusColor}`} />

          <span className={`text-[10px] font-black tracking-widest uppercase text-${statusColor}`}>
            {statusText}
          </span>
        </div>

        <h3 className="text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
          {store.name}
        </h3>

        <p className="text-xs font-bold text-slate-400">/{store.slug}</p>
      </div>

      <Link
        href={`${basePath}/stores/${store.slug}`}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white transition-all hover:bg-indigo-600 active:scale-90"
      >
        <ArrowUpRight size={24} />
      </Link>
    </div>
  );
};
