"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductRequest } from "@/@types/product/product-request";
import { ProductResponse } from "@/@types/product/product-response";
import { ProductForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/product-manager/product/product-form";
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
      setApiError(
        error instanceof ApiError ? error.message : "Erro ao carregar produto."
      );
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
      setApiError(
        error instanceof ApiError ? error.message : "Erro ao atualizar produto."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-40 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">
        Sincronizando Ativo...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] mx-auto max-w-400 px-6 pt-32 pb-20">
      <div className="mb-10 border-b border-slate-200 pb-8">
        <Link
          href={backPath}
          className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Cancelar Operação
        </Link>
        <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
          EDITAR <span className="text-indigo-600">PRODUTO.</span>
        </h1>
      </div>

      {apiError && (
        <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
          <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
            {apiError}
          </p>
        </div>
      )}

      <ProductForm
        initialData={product}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        slug={storeSlug}
      />
    </main>
  );
};
