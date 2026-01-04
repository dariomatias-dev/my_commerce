"use client";

import { PlusCircle, StoreIcon } from "lucide-react";
import Link from "next/link";

export const StoresDashboardEmptyStores = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 rounded-[3rem] border border-slate-200 bg-white p-20 text-center shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-600">
        <StoreIcon size={48} />
      </div>

      <div className="max-w-xl space-y-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase">
            Status: Sem Lojas
          </span>

          <h2 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
            Nenhuma <span className="text-indigo-600">Loja Ativa.</span>
          </h2>
        </div>

        <p className="text-lg font-medium text-slate-500 italic">
          O sistema não detectou nenhuma loja vinculada à sua conta. Crie a sua
          primeira loja para começar.
        </p>
      </div>

      <Link
        href="/dashboard/store/new"
        className="group flex items-center gap-4 rounded-2xl bg-slate-950 px-12 py-6 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95"
      >
        <PlusCircle size={20} />
        CRIAR MINHA PRIMEIRA LOJA
      </Link>
    </div>
  );
};
