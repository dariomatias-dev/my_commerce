"use client";

import { useParams } from "next/navigation";

import { StoreDashboard } from "@/components/stores-dashboard/store-dashboard";

const StoreDashboardPage = () => {
  const { slug } = useParams() as { slug: string };

  return (
    <StoreDashboard
      slug={slug}
      backPath="/dashboard"
      backLabel="Voltar para dashboard"
      productsPath={`/dashboard/store/${slug}/products`}
      createProductPath={`/dashboard/store/${slug}/products/new`}
    />
  );
};

export default StoreDashboardPage;
