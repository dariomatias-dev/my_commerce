"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreRequest } from "@/@types/store/store-request";
import { StoreResponse } from "@/@types/store/store-response";
import {
  StoreForm,
  StoreFormValues,
} from "@/components/dashboard/store/store-form";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { useStore } from "@/services/hooks/use-store";

interface EditStoreFormProps {
  storeSlug: string;
  backPath: string;
  successPath: string;
}

export const EditStoreForm = ({
  storeSlug,
  backPath,
  successPath,
}: EditStoreFormProps) => {
  const router = useRouter();
  const { getStoreBySlug, updateStore } = useStore();

  const [store, setStore] = useState<StoreResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadStore = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await getStoreBySlug(storeSlug);

      setStore(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Erro ao carregar loja.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeSlug, getStoreBySlug]);

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

      router.push(successPath);
    } catch (error) {
      setApiError(
        error instanceof ApiError ? error.message : "Erro ao atualizar loja."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Sincronizando instância..." />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-400 px-6 pt-32 pb-20">
      <DashboardPageHeader
        title="EDITAR UNIDADE"
        subtitle="Gerencie as informações e a identidade visual da sua loja"
        label="CONFIGURAÇÕES"
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
        <StoreForm
          initialData={store}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </main>
  );
};
