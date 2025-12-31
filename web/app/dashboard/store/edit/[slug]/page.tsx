"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreRequest } from "@/@types/store/store-request";
import { StoreResponse } from "@/@types/store/store-response";
import {
  StoreForm,
  StoreFormValues,
} from "@/components/dashboard/store/store-form";
import { useStore } from "@/services/hooks/use-store";

const EditStorePage = () => {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { getStoreBySlug, updateStore } = useStore();

  const [store, setStore] = useState<StoreResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadStore = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getStoreBySlug(slug);
      setStore(data);
    } catch (error) {
      setApiError(
        error instanceof ApiError ? error.message : "Erro ao carregar loja."
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug, getStoreBySlug]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const onSubmit = async (values: StoreFormValues) => {
    if (!store) return;
    try {
      setIsSubmitting(true);
      setApiError(null);

      const data: StoreRequest = {
        name: values.name,
        description: values.description,
        themeColor: values.themeColor,
        isActive: values.isActive,
      };

      await updateStore(store.id, data, values.logo?.[0], values.banner?.[0]);
      router.push("/dashboard");
    } catch (error) {
      setApiError(
        error instanceof ApiError ? error.message : "Erro ao atualizar loja."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-40 text-center font-black animate-pulse uppercase">
        Sincronizando Instância...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] mx-auto max-w-400 px-6 pt-32 pb-20">
      <div className="mb-10 border-b border-slate-200 pb-8">
        <Link
          href="/dashboard"
          className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Cancelar Edição
        </Link>
        <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
          EDITAR <span className="text-indigo-600">UNIDADE.</span>
        </h1>
      </div>

      {apiError && (
        <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
          <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
            {apiError}
          </p>
        </div>
      )}

      <StoreForm
        initialData={store}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </main>
  );
};

export default EditStorePage;
