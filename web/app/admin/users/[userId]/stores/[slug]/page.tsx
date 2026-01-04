"use client";

import { useParams } from "next/navigation";

import { StoreManagement } from "@/components/store-management/store-management";

const AdminStoreDashboardPage = () => {
  const { slug } = useParams() as { slug: string };

  return (
    <StoreManagement
      slug={slug}
      backPath="/admin/stores"
      backLabel="Voltar para gestão de lojas"
      productsPath={`/admin/stores/${slug}/products`}
      createProductPath={`/admin/stores/${slug}/products/new`}
    />
  );
};

export default AdminStoreDashboardPage;
