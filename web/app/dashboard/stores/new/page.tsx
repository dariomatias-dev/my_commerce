"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreRequest } from "@/@types/store/store-request";
import {
  StoreForm,
  StoreFormValues,
} from "@/components/dashboard/store/store-form";
import { useStore } from "@/services/hooks/use-store";

const NewStorePage = () => {
  const router = useRouter();

  const { createStore } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmit = async (values: StoreFormValues) => {
    try {
      setIsLoading(true);
      setGlobalError(null);

      const data: StoreRequest = {
        name: values.name,
        description: values.description,
        themeColor: values.themeColor,
        isActive: values.isActive,
      };

      await createStore(data, values.logo?.[0], values.banner?.[0]);
      router.push("/dashboard");
    } catch (error) {
      setGlobalError(
        error instanceof ApiError
          ? error.message
          : "Erro ao inicializar nova instância."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FA] mx-auto max-w-400 px-6 pt-32 pb-20">
      <div className="mb-10 border-b border-slate-200 pb-8">
        <Link
          href="/dashboard"
          className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Voltar ao Painel
        </Link>
        <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
          CRIAR NOVA <span className="text-indigo-600">LOJA.</span>
        </h1>
      </div>

      {globalError && (
        <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
          <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
            {globalError}
          </p>
        </div>
      )}

      <StoreForm onSubmit={onSubmit} isLoading={isLoading} />
    </main>
  );
};

export default NewStorePage;
