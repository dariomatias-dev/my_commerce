"use client";

import { useParams } from "next/navigation";

import { StoreProductsDashboard } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard";

const StoreProductsPage = () => {
  const { storeSlug } = useParams() as { storeSlug: string };

  return (
    <StoreProductsDashboard
      storeSlug={storeSlug}
      basePath={`/dashboard/stores/${storeSlug}`}
    />
  );
};

export default StoreProductsPage;
