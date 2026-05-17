"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ApiError } from "@/@types/api";
import { StoreRequest } from "@/@types/store/store-request";
import { StoreResponse } from "@/@types/store/store-response";
import { updateStore } from "@/app/actions/stores";
import { StoreForm, StoreFormValues } from "@/components/dashboard/store/store-form";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { getStoreBySlug } from "@/services/stores";

interface EditStoreFormProps {
  storeSlug: string;
  backPath: string;
  successPath: string;
}

export const EditStoreForm = ({ storeSlug, backPath, successPath }: EditStoreFormProps) => {
  const router = useRouter();

  const [store, setStore] = useState<StoreResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadStore() {
      setIsLoading(true);

      try {
        const data = await getStoreBySlug(storeSlug);

        if (!ignore) setStore(data);
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setApiError(error.message);
          } else {
            setApiError("Erro ao carregar loja.");
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadStore();

    return () => {
      ignore = true;
    };
  }, [storeSlug]);

  const onSubmit = async (values: StoreFormValues) => {
    if (!store) return;

    setIsSubmitting(true);
    setApiError(null);

    const data: StoreRequest = {
      name: values.name,
      description: values.description,
      themeColor: values.themeColor,
      isActive: values.isActive,
    };

    const result = await updateStore(store.id, data, values.logo?.[0], values.banner?.[0]);

    if (!result.success) {
      setApiError(result.error);
      setIsSubmitting(false);

      return;
    }

    router.push(successPath);
  };

  if (isLoading) {
    return <LoadingIndicator message="Sincronizando instância..." />;
  }

  return (
    <>
      <DashboardPageHeader
        title="EDITAR UNIDADE"
        subtitle="Gerencie as informações e a identidade visual da sua loja"
        label="CONFIGURAÇÕES"
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
        <StoreForm initialData={store} onSubmit={onSubmit} isLoading={isSubmitting} />
      </div>
    </>
  );
};
