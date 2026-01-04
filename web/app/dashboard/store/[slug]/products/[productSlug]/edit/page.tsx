"use client";

import { useParams } from "next/navigation";

import { ProductEditForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/product-manager/product/product-edit-form";

const EditProductDashboardPage = () => {
  const { slug, productSlug } = useParams() as {
    slug: string;
    productSlug: string;
  };

  return (
    <ProductEditForm
      storeSlug={slug}
      productSlug={productSlug}
      backPath={`/dashboard/store/${slug}/products`}
      successPath={`/dashboard/store/${slug}/products`}
    />
  );
};

export default EditProductDashboardPage;
