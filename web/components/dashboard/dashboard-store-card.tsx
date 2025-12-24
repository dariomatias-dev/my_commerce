import { ArrowRight, StoreIcon } from "lucide-react";
import Link from "next/link";

import { StoreResponse } from "@/@types/store/store-response";

interface StoreCardProps {
  store: StoreResponse;
}

export const StoreCard = ({ store }: StoreCardProps) => (
  <Link
    href={`/dashboard/store/${store.slug}`}
    className="group relative flex flex-col items-start overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-9 text-left transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10"
  >
    <div className="mb-8 flex w-full items-center justify-between">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 transition-transform group-hover:rotate-12 group-hover:bg-indigo-600 group-hover:text-white">
        <StoreIcon size={28} />
      </div>
      <div
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black tracking-widest uppercase ${
          store.isActive
            ? "bg-emerald-50 text-emerald-600"
            : "bg-orange-50 text-orange-600"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            store.isActive ? "animate-pulse bg-emerald-500" : "bg-orange-500"
          }`}
        />
        {store.isActive ? "ATIVA" : "INATIVA"}
      </div>
    </div>

    <h3 className="text-3xl leading-none font-black tracking-tighter text-slate-950 uppercase italic">
      {store.name}
    </h3>
    <p className="mt-3 text-xs font-bold tracking-widest text-slate-400">
      {store.slug}
    </p>

    <div className="mt-12 flex w-full items-center justify-between border-t border-slate-50 pt-6">
      <div>
        <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
          Controle da Loja
        </p>
        <p className="text-lg font-black text-slate-950 italic uppercase tracking-tighter">
          Gerenciar
        </p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-all group-hover:bg-indigo-600">
        <ArrowRight size={22} />
      </div>
    </div>
  </Link>
);
