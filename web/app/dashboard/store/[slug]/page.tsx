"use client";

import { useParams } from "next/navigation";

import { StoreManagement } from "@/components/store-management/store-management";

const StoreDashboardPage = () => {
  const { slug } = useParams() as { slug: string };

  return (
    <StoreManagement
      slug={slug}
      backPath="/dashboard"
      backLabel="Voltar para dashboard"
      productsPath={`/dashboard/store/${slug}/products`}
      createProductPath={`/dashboard/store/${slug}/products/new`}
    />
  );
};

export default StoreDashboardPage;
