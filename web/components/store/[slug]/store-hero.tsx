"use client";

import Image from "next/image";

import { ArrowRight } from "lucide-react";

import { StoreResponse } from "@/@types/store/store-response";

interface StoreHeroProps {
  store: StoreResponse;
  bannerUrl: string;
}

export const StoreHero = ({ store, bannerUrl }: StoreHeroProps) => {
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10">
      <div className="relative h-162.5 w-full overflow-hidden rounded-[4rem] bg-slate-950 text-white shadow-2xl">
        <Image
          src={bannerUrl}
          alt="Banner"
          fill
          priority
          unoptimized
          className="object-cover opacity-50 mix-blend-luminosity transition-transform duration-[10s] hover:scale-110"
        />

        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-center p-12 lg:p-24">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-indigo-500" />
            <span className="text-xs font-black tracking-[0.5em] text-indigo-400 uppercase">
              Lançamento Temporada 2025
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-7xl leading-[0.85] font-black tracking-tighter uppercase italic md:text-9xl">
            {store.name} <br /> <span className="text-indigo-600">COLEÇÃO.</span>
          </h1>

          <p className="mt-10 line-clamp-3 max-w-xl text-xl leading-relaxed font-medium text-slate-300 italic">
            {store.description}
          </p>

          <div className="mt-14 flex flex-wrap gap-5">
            <button
              onClick={scrollToCatalog}
              className="rounded-2xl bg-white px-12 py-6 text-xs font-black tracking-[0.3em] text-slate-950 uppercase transition-all outline-none hover:bg-indigo-600 hover:text-white active:scale-95"
            >
              Explorar Catálogo
            </button>

            <button className="flex items-center gap-3 rounded-2xl border-2 border-white/20 bg-white/5 px-10 py-6 text-xs font-black tracking-[0.3em] uppercase backdrop-blur-md transition-all outline-none hover:bg-white/10 active:scale-95">
              Ver Coleção <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
