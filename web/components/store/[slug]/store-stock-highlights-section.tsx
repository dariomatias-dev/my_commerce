import { useEffect, useMemo, useState } from "react";

import { ProductResponse } from "@/@types/product/product-response";
import { useProduct } from "@/services/hooks/use-product";
import { ProductCard } from "./product-card";

interface StoreStockHighlightsSectionProps {
  storeId: string;
}

export const StoreStockHighlightsSection = ({
  storeId,
}: StoreStockHighlightsSectionProps) => {
  const { getProductsByStoreId } = useProduct();
  const [products, setProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProductsByStoreId(storeId, 0, 100);
      setProducts(data.content);
    };
    loadProducts();
  }, [storeId, getProductsByStoreId]);

  const lastUnits = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 5).slice(0, 2),
    [products]
  );

  const newEntries = useMemo(() => products.slice(-2), [products]);

  if (products.length === 0) return null;

  return (
    <section className="py-24 border-b border-slate-100">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="rounded-[3.5rem] border-2 border-orange-100 bg-orange-50/20 p-12">
          <h3 className="text-4xl font-black tracking-tighter text-orange-600 uppercase italic mb-12">
            ÚLTIMAS <span className="text-slate-950">UNIDADES.</span>
          </h3>
          <div className="grid gap-8 sm:grid-cols-2">
            {lastUnits.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <div className="rounded-[3.5rem] border-2 border-emerald-100 bg-emerald-50/20 p-12">
          <h3 className="text-4xl font-black tracking-tighter text-emerald-600 uppercase italic mb-12">
            NOVIDADES <span className="text-slate-950">RECENTES.</span>
          </h3>
          <div className="grid gap-8 sm:grid-cols-2">
            {newEntries.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
