"use client";

import { Heart } from "lucide-react";
import Image from "next/image";

import { StoreResponse } from "@/@types/store/store-response";
import { HeaderNavAuth } from "@/components/layout/header-nav-auth";
import { StoreCart } from "./store-cart";

interface StoreHeaderProps {
  store: StoreResponse;
}

export const StoreHeader = ({ store }: StoreHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-100">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${store.slug}/logo.jpeg`}
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

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
            <button className="group flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 text-slate-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 active:scale-90 outline-none">
              <Heart
                size={20}
                className="transition-transform group-hover:scale-105"
              />
            </button>

            <StoreCart storeId={store.id} />
          </div>

          <HeaderNavAuth />
        </div>
      </div>
    </header>
  );
};
