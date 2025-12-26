"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { ApiError } from "@/@types/api";
import {
  ProductForm,
  ProductFormValues,
} from "@/components/dashboard/store/[slug]/products/product-form";
import { useProduct } from "@/services/hooks/use-product";

export default function NewProductPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { createProduct } = useProduct();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (data: ProductFormValues, storeId: string) => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const payload = { ...data, storeId };
      await createProduct(payload, data.images || []);

      router.push(`/dashboard/store/${slug}/products`);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Erro ao registrar novo produto.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FA] mx-auto max-w-4xl px-6 pt-32 pb-20">
      <div className="mb-10">
        <Link
          href={`/dashboard/store/${slug}/products`}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600"
        >
          <ArrowLeft size={14} /> Voltar ao Inventário
        </Link>
        <h1 className="text-5xl font-black text-slate-950 uppercase italic mt-4">
          NOVO <span className="text-indigo-600">PRODUTO.</span>
        </h1>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 text-xs font-black uppercase text-center">
          {apiError}
        </div>
      )}

      <ProductForm
        slug={slug}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
