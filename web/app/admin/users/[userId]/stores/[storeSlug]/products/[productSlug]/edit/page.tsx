"use client";

import { useParams } from "next/navigation";

import { ProductEditForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/product-manager/product/product-edit-form";

const AdminEditProductPage = () => {
  const { storeSlug, userId, productSlug } = useParams() as {
    storeSlug: string;
    userId: string;
    productSlug: string;
  };

  return (
    <ProductEditForm
      storeSlug={storeSlug}
      productSlug={productSlug}
      backPath={`/admin/users/${userId}/stores/${storeSlug}/products`}
      successPath={`/admin/users/${userId}/stores/${storeSlug}/products`}
    />
  );
};

export default AdminEditProductPage;
