"use client";

import { useParams } from "next/navigation";

import { StoreDashboard } from "@/components/stores-dashboard/store-dashboard";

const AdminStoreDashboardPage = () => {
  const { slug } = useParams() as { slug: string };

  return (
    <StoreDashboard
      slug={slug}
      backPath="/admin/stores"
      backLabel="Voltar para gestão de lojas"
      productsPath={`/admin/stores/${slug}/products`}
      createProductPath={`/admin/stores/${slug}/products/new`}
    />
  );
};

export default AdminStoreDashboardPage;
