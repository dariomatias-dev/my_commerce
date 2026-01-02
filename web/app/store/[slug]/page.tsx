"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ProductResponse } from "@/@types/product/product-response";
import { StoreResponse } from "@/@types/store/store-response";
import { Footer } from "@/components/layout/footer";
import { StoreBestSellersSection } from "@/components/store/[slug]/store-best-sellers-section";
import { StoreCatalogSection } from "@/components/store/[slug]/store-catalog-section";
import { StoreHeader } from "@/components/store/[slug]/store-header";
import { StoreHero } from "@/components/store/[slug]/store-hero";
import { StoreSpotlightSection } from "@/components/store/[slug]/store-spotlight-section";
import { StoreStockHighlightsSection } from "@/components/store/[slug]/store-stock-highlights-section";
import { useProduct } from "@/services/hooks/use-product";
import { useStore } from "@/services/hooks/use-store";

const StorePage = () => {
  const { slug } = useParams() as { slug: string };
  const { getStoreBySlug } = useStore();
  const { getAllProducts } = useProduct();

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [spotlightProduct, setSpotlightProduct] =
    useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStore = useCallback(async () => {
    try {
      setIsLoading(true);

      const storeData = await getStoreBySlug(slug);
      setStore(storeData);

      const productsData = await getAllProducts(
        { storeId: storeData.id },
        0,
        1
      );
      setSpotlightProduct(productsData.content[0] || null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, getAllProducts, getStoreBySlug]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  if (isLoading || !store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-black uppercase italic tracking-tighter text-slate-950">
        Sincronizando Ambiente...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <StoreHeader store={store} />

      <main className="mx-auto max-w-400 px-8">
        <StoreHero
          store={store}
          bannerUrl={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${store.slug}/banner.jpeg`}
        />

        <StoreBestSellersSection storeId={store.id} />

        {spotlightProduct && (
          <StoreSpotlightSection product={spotlightProduct} />
        )}

        <StoreStockHighlightsSection storeId={store.id} />

        <StoreCatalogSection storeId={store.id} />
      </main>

      <Footer />
    </div>
  );
};

export default StorePage;
