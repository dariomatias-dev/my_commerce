"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductRequest } from "@/@types/product/product-request";
import { ProductResponse } from "@/@types/product/product-response";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { ProductForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/products-dashboard/product/product-form";
import { ProductFormValues } from "@/schemas/product.schema";
import { useProduct } from "@/services/hooks/use-product";

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
  const { getProductBySlug, updateProduct } = useProduct();

  const [product, setProduct] = useState<ProductResponse | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await getProductBySlug(storeSlug, productSlug);

      setProduct(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Erro ao carregar produto.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeSlug, productSlug, getProductBySlug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const onSubmit = async (values: ProductFormValues) => {
    if (!product) return;

    try {
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

      await updateProduct(product.id, data, values.images);

      router.push(successPath);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Erro ao atualizar produto.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
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
