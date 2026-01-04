"use client";

import { useParams } from "next/navigation";

import { StoreProductsDashboard } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard";

const StoreProductsPage = () => {
  const { slug } = useParams() as { slug: string };

  return (
    <StoreProductsDashboard
      slug={slug}
      backPath={`/dashboard/store/${slug}`}
      createProductPath={`/dashboard/store/${slug}/products/new`}
    />
  );
};

export default StoreProductsPage;
