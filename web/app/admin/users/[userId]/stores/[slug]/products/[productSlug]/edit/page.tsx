"use client";

import { useParams } from "next/navigation";

import { ProductEditForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/product-manager/product/product-edit-form";

const AdminEditProductPage = () => {
  const { userId, slug, productSlug } = useParams() as {
    userId: string;
    slug: string;
    productSlug: string;
  };

  return (
    <ProductEditForm
      storeSlug={slug}
      productSlug={productSlug}
      backPath={`/admin/users/${userId}/stores/${slug}/products`}
      successPath={`/admin/users/${userId}/stores/${slug}/products`}
    />
  );
};

export default AdminEditProductPage;
