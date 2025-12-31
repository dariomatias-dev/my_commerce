"use client";

import { Heart, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";

import { StoreResponse } from "@/@types/store/store-response";

interface StoreHeaderProps {
  store: StoreResponse;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const StoreHeader = ({
  store,
  searchQuery,
  setSearchQuery,
}: StoreHeaderProps) => {
  const logoUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stores/${store.slug}/logo.jpeg`;

  return (
    <header className="sticky top-0 z-100 border-b-2 border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-400 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-100">
            <Image
              src={logoUrl}
              alt={store.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-950">
              {store.name}
            </span>
            <span className="text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Official Store
            </span>
          </div>
        </div>

        <div className="hidden max-w-xl flex-1 px-12 lg:block">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Pesquisar no catálogo..."
              className="w-full rounded-2xl border-slate-100 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-bold outline-none border-2 focus:border-indigo-600 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 transition-all outline-none focus:border-indigo-600">
            <Heart size={22} />
          </button>

          <button className="group relative flex h-14 items-center gap-4 rounded-2xl bg-slate-950 px-8 text-white transition-all hover:bg-indigo-600 active:scale-95 border-2 border-transparent focus:border-indigo-600 outline-none">
            <ShoppingBag size={22} />
            <span className="text-xs font-black tracking-[0.2em] uppercase italic">
              Sacola
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500 text-xs font-black shadow-lg">
              0
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
