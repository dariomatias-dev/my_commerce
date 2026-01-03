"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductRequest } from "@/@types/product/product-request";
import { ProductResponse } from "@/@types/product/product-response";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { ProductForm } from "@/components/dashboard/store/[slug]/products/product-form";
import { ProductFormValues } from "@/schemas/product.schema";
import { useProduct } from "@/services/hooks/use-product";

const EditProductPage = () => {
  const { slug, productSlug } = useParams() as {
    slug: string;
    productSlug: string;
  };
  const router = useRouter();
  const { getProductBySlug, updateProduct } = useProduct();

  const [product, setProduct] = useState<ProductResponse | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProductBySlug(slug, productSlug);
      setProduct(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Produto não localizado no servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug, productSlug, getProductBySlug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleSubmit = async (
    data: ProductFormValues,
    storeId: string,
    removedImageNames?: string[]
  ) => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const payload: ProductRequest = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        active: data.active,
        storeId,
        images: data.images,
        removedImageNames,
      };

      await updateProduct(product!.id, payload, data.images);

      router.push(`/dashboard/store/${slug}/products`);
    } catch (error) {
      setApiError(
        error instanceof ApiError ? error.message : "Erro ao atualizar produto."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <DashboardLoading message="Carregando produto..." />;
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] mx-auto max-w-4xl px-6 pt-32 pb-20">
      <div className="mb-10">
        <Link
          href={`/dashboard/store/${slug}/products`}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Cancelar Operação
        </Link>
        <h1 className="text-5xl font-black text-slate-950 uppercase italic mt-4">
          EDITAR <span className="text-indigo-600">PRODUTO.</span>
        </h1>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 text-xs font-black uppercase text-center">
          {apiError}
        </div>
      )}

      <ProductForm
        slug={slug}
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
};

export default EditProductPage;
