"use client";

import { useParams } from "next/navigation";

import { StoreDashboard } from "@/components/stores-dashboard/store-dashboard";

const StoreDashboardPage = () => {
  const { storeSlug } = useParams() as { storeSlug: string };

  return (
    <StoreDashboard
      storeSlug={storeSlug}
      basePath="/dashboard/stores"
      backLabel="Voltar para as lojas"
    />
  );
};

export default StoreDashboardPage;
