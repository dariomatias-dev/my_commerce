"use client";

import { useParams } from "next/navigation";

import { ProductEditForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/products-dashboard/product/product-edit-form";

const EditProductDashboardPage = () => {
  const { storeSlug, productSlug } = useParams() as {
    storeSlug: string;
    productSlug: string;
  };

  return (
    <ProductEditForm
      storeSlug={storeSlug}
      productSlug={productSlug}
      backPath={`/dashboard/stores/${storeSlug}/products`}
      successPath={`/dashboard/stores/${storeSlug}/products`}
    />
  );
};

export default EditProductDashboardPage;
