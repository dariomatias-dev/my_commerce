"use client";

import { useEffect, useState } from "react";

import { ProductResponse } from "@/@types/product/product-response";
import { StoreBestSellersSection } from "@/components/store/[slug]/store-best-sellers-section";
import { StoreCatalogSection } from "@/components/store/[slug]/store-catalog-section";
import { StoreHero } from "@/components/store/[slug]/store-hero";
import { StoreSpotlightSection } from "@/components/store/[slug]/store-spotlight-section";
import { StoreStockHighlightsSection } from "@/components/store/[slug]/store-stock-highlights-section";
import { useStoreContext } from "@/contexts/store-context";
import { getAllProducts } from "@/services/products";

const StorePage = () => {
  const { store } = useStoreContext();

  const [spotlightProduct, setSpotlightProduct] = useState<ProductResponse | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      try {
        setIsProductsLoading(true);

        const productsData = await getAllProducts({ storeId: store.id }, 0, 1);

        if (!ignore) setSpotlightProduct(productsData.content[0] || null);
      } catch {
      } finally {
        if (!ignore) setIsProductsLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [store.id]);

  return (
    <main className="mx-auto max-w-400 px-8 pt-32 pb-20">
      <StoreHero
        store={store}
        bannerUrl={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${store.slug}/banner.jpeg`}
      />

      <StoreBestSellersSection storeId={store.id} />

      {!isProductsLoading && spotlightProduct && (
        <StoreSpotlightSection product={spotlightProduct} />
      )}

      <StoreStockHighlightsSection storeId={store.id} />

      <StoreCatalogSection storeId={store.id} />
    </main>
  );
};

export default StorePage;
