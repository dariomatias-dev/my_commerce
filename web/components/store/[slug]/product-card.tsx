"use client";

import { Clock, Plus, Sparkles } from "lucide-react";
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

export const ProductCard = ({ product }: { product: ProductResponse }) => {
  const imgUrl = product.images?.[0]?.url || "";

  return (
    <div className="group relative flex flex-col rounded-[3rem] border-2 border-slate-100 bg-white p-5 transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10 focus-within:border-indigo-600 outline-none">
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-50">
        {imgUrl && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${imgUrl}`}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="warning">
              <Clock size={10} /> Últimas Unidades
            </Badge>
          )}
          {product.price < 100 && (
            <Badge variant="new">
              <Sparkles size={10} /> Oferta
            </Badge>
          )}
        </div>

        <button className="absolute bottom-5 right-5 h-14 w-14 flex items-center justify-center rounded-[1.5rem] bg-white/90 backdrop-blur-md shadow-xl text-slate-950 transition-all hover:bg-indigo-600 hover:text-white translate-y-24 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 border-2 border-transparent focus:border-indigo-600 outline-none cursor-pointer">
          <Plus size={28} />
        </button>
      </div>

      <div className="mt-7 px-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          ID: {product.slug.split("-")[0]}
        </span>

        <h3 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 uppercase italic leading-tight group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        <div className="mt-5 flex items-center gap-4">
          <span className="text-2xl font-black tracking-tighter text-slate-950">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
