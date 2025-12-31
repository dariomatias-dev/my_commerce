"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { ProductResponse } from "@/@types/product/product-response";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "hot" | "warning" | "new";
}

const Badge = ({ children, variant = "default" }: BadgeProps) => {
  const styles = {
    default: "bg-slate-100 text-slate-600",
    hot: "bg-indigo-600 text-white shadow-lg shadow-indigo-200",
    warning: "bg-orange-500 text-white shadow-lg shadow-orange-200",
    new: "bg-emerald-500 text-white shadow-lg shadow-emerald-200",
  };
  return (
    <div
      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${styles[variant]}`}
    >
      {children}
    </div>
  );
};

interface StoreSpotlightSectionProps {
  product: ProductResponse;
}

export const StoreSpotlightSection = ({
  product,
}: StoreSpotlightSectionProps) => {
  return (
    <section className="py-24">
      <div className="relative overflow-hidden rounded-[4rem] bg-slate-50 border-2 border-slate-100 p-12 lg:p-24">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-[3.5rem] bg-white shadow-2xl ring-1 ring-slate-100">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${product.images[0].url}`}
              alt="Destaque"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="space-y-12">
            <div>
              <Badge variant="hot">Produto em Destaque</Badge>
              <h2 className="mt-8 text-7xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                {product.name}
              </h2>
              <p className="mt-10 text-2xl font-medium leading-relaxed text-slate-500 italic">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Investimento
                </span>
                <span className="text-5xl font-black tracking-tighter text-slate-950 italic">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>

              <button className="group flex items-center gap-5 rounded-[2rem] bg-indigo-600 px-12 py-7 text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-slate-950 active:scale-95 outline-none">
                <span className="text-sm font-black tracking-[0.2em] uppercase">
                  Adicionar ao Carrinho
                </span>
                <ArrowRight
                  size={22}
                  className="transition-transform group-hover:translate-x-2"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
