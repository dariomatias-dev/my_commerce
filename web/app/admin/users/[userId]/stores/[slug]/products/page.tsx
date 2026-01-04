"use client";

import { useParams } from "next/navigation";

import { StoreProductsDashboard } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard";

const AdminStoreProductsPage = () => {
  const { userId, slug } = useParams() as { userId: string; slug: string };

  return (
    <StoreProductsDashboard
      slug={slug}
      backPath={`/admin/users/${userId}/stores/${slug}`}
      createProductPath={`/admin/users/${userId}/stores/${slug}/products/new`}
      canCreate={false}
    />
  );
};

export default AdminStoreProductsPage;
