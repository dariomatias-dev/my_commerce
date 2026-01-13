"use client";

import { useParams } from "next/navigation";

import { StoreDashboard } from "@/components/stores-dashboard/store-dashboard";

const AdminStoreDashboardPage = () => {
  const { storeSlug, userId } = useParams() as {
    storeSlug: string;
    userId: string;
  };

  return (
    <StoreDashboard
      storeSlug={storeSlug}
      basePath={`/admin/users/${userId}/stores`}
      backLabel="Voltar para gestão de lojas"
      canCreate={false}
    />
  );
};

export default AdminStoreDashboardPage;
