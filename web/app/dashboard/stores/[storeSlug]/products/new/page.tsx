"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { createProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/products-dashboard/product/product-form";
import { ProductFormValues } from "@/schemas/product.schema";

const NewProductPage = () => {
  const { storeSlug } = useParams() as { storeSlug: string };

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (data: ProductFormValues, storeId: string) => {
    setIsSubmitting(true);
    setApiError(null);

    const payload = { ...data, storeId };
    const result = await createProduct(payload, data.images || []);

    setIsSubmitting(false);

    if (!result.success) {
      setApiError(result.error);
      return;
    }

    router.push(`/dashboard/stores/${storeSlug}/products`);
  };

  return (
    <>
      <div className="mb-10">
        <Link
          href={`/dashboard/stores/${storeSlug}/products`}
          className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
        >
          <ArrowLeft size={14} /> Voltar
        </Link>

        <h1 className="mt-4 text-5xl font-black text-slate-950 uppercase italic">
          NOVO <span className="text-indigo-600">PRODUTO.</span>
        </h1>
      </div>

      {apiError && (
        <div className="mb-6 border border-red-100 bg-red-50 p-4 text-center text-xs font-black text-red-500 uppercase">
          {apiError}
        </div>
      )}

      <ProductForm storeSlug={storeSlug} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </>
  );
};

export default NewProductPage;
