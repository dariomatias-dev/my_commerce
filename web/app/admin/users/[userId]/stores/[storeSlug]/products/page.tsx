"use client";

import { useParams } from "next/navigation";

import { StoreProductsDashboard } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard";

const AdminStoreProductsPage = () => {
  const { storeSlug, userId } = useParams() as {
    storeSlug: string;
    userId: string;
  };

  return (
    <StoreProductsDashboard
      storeSlug={storeSlug}
      backPath={`/admin/users/${userId}/stores/${storeSlug}`}
      canCreate={false}
    />
  );
};

export default AdminStoreProductsPage;
