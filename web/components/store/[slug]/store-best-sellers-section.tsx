import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";

import { ProductResponse } from "@/@types/product/product-response";
import { useProduct } from "@/services/hooks/use-product";

interface StoreBestSellersSectionProps {
  storeId: string;
}

export const StoreBestSellersSection = ({
  storeId,
}: StoreBestSellersSectionProps) => {
  const { getAllProductsByStoreId } = useProduct();
  const [products, setProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAllProductsByStoreId(storeId, {}, 0, 4);
      setProducts(data.content);
    };
    loadProducts();
  }, [storeId, getAllProductsByStoreId]);

  if (products.length === 0) return null;

  return (
    <section className="py-24 border-b border-slate-100">
      <div className="mb-16">
        <div className="flex items-center gap-2 text-indigo-600 mb-4">
          <Flame size={20} fill="currentColor" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">
            Destaques
          </span>
        </div>
        <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
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
