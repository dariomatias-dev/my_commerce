"use client";

import { useCallback, useEffect, useState } from "react";

import { ProductResponse } from "@/@types/product/product-response";
import { StoreBestSellersSection } from "@/components/store/[slug]/store-best-sellers-section";
import { StoreCatalogSection } from "@/components/store/[slug]/store-catalog-section";
import { StoreHero } from "@/components/store/[slug]/store-hero";
import { StoreSpotlightSection } from "@/components/store/[slug]/store-spotlight-section";
import { StoreStockHighlightsSection } from "@/components/store/[slug]/store-stock-highlights-section";
import { useStoreContext } from "@/contexts/store-context";
import { useProduct } from "@/services/hooks/use-product";

const StorePage = () => {
  const { store } = useStoreContext();

  const { getAllProducts } = useProduct();

  const [spotlightProduct, setSpotlightProduct] =
    useState<ProductResponse | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  const fecthProducts = useCallback(async () => {
    try {
      setIsProductsLoading(true);

      const productsData = await getAllProducts({ storeId: store.id }, 0, 1);

      setSpotlightProduct(productsData.content[0] || null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProductsLoading(false);
    }
  }, [store.id, getAllProducts]);

  useEffect(() => {
    fecthProducts();
  }, [fecthProducts]);

  return (
    <main className="mx-auto max-w-400 pt-32 px-8 pb-20">
      <StoreHero
        store={store}
        bannerUrl={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${store.slug}/banner.png`}
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
