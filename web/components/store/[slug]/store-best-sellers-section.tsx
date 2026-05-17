import { useEffect, useState } from "react";

import { Flame } from "lucide-react";

import { ProductResponse } from "@/@types/product/product-response";
import { getAllProducts } from "@/services/products";

import { ProductCard } from "./product-card";

interface StoreBestSellersSectionProps {
  storeId: string;
}

export const StoreBestSellersSection = ({ storeId }: StoreBestSellersSectionProps) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAllProducts({ storeId }, 0, 4);
      setProducts(data.content);
    };
    loadProducts();
  }, [storeId]);

  if (products.length === 0) return null;

  return (
    <section className="border-b border-slate-100 py-24">
      <div className="mb-16">
        <div className="mb-4 flex items-center gap-2 text-indigo-600">
          <Flame size={20} fill="currentColor" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">Destaques</span>
        </div>
        <h2 className="text-6xl leading-none font-black tracking-tighter text-slate-950 uppercase italic">
          MAIS <span className="text-indigo-600">VENDIDOS.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
