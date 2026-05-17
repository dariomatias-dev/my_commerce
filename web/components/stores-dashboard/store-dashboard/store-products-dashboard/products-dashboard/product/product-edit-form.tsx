"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ApiError } from "@/@types/api";
import { ProductRequest } from "@/@types/product/product-request";
import { ProductResponse } from "@/@types/product/product-response";
import { updateProduct } from "@/app/actions/products";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { ProductForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/products-dashboard/product/product-form";
import { ProductFormValues } from "@/schemas/product.schema";
import { getProductBySlug } from "@/services/products";

interface ProductEditFormProps {
  storeSlug: string;
  productSlug: string;
  backPath: string;
  successPath: string;
}

export const ProductEditForm = ({
  storeSlug,
  productSlug,
  backPath,
  successPath,
}: ProductEditFormProps) => {
  const router = useRouter();

  const [product, setProduct] = useState<ProductResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setIsLoading(true);

      try {
        const data = await getProductBySlug(storeSlug, productSlug);

        if (!ignore) setProduct(data);
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setApiError(error.message);
          } else {
            setApiError("Erro ao carregar produto.");
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [storeSlug, productSlug]);

  const onSubmit = async (
    values: ProductFormValues,
    _storeId: string,
    removedImages?: string[],
  ) => {
    if (!product) return;

    setIsSubmitting(true);
    setApiError(null);

    const data: Partial<ProductRequest> = {
      name: values.name,
      description: values.description,
      price: values.price,
      stock: values.stock,
      categoryId: values.categoryId,
      active: values.active,
    };

    const result = await updateProduct(product.id, data, values.images, removedImages);

    setIsSubmitting(false);

    if (!result.success) {
      setApiError(result.error);

      return;
    }

    router.push(successPath);
  };

  if (isLoading) {
    return <LoadingIndicator message="Sincronizando dados do produto..." />;
  }

  return (
    <>
      <DashboardPageHeader
        title="EDITAR PRODUTO"
        subtitle="Gerencie as informações, preço e disponibilidade do item no catálogo"
        label="CATÁLOGO"
        backPath={backPath}
      />

      {apiError && (
        <div className="animate-in fade-in slide-in-from-top-2 mb-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
            {apiError}
          </p>
        </div>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProductForm
          initialData={product}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          storeSlug={storeSlug}
        />
      </div>
    </>
  );
};
