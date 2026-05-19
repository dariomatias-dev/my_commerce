"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { AlertCircle, ArrowLeft, RefreshCcw, Store } from "lucide-react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { Footer } from "@/components/layout/footer";
import { StoreHeader } from "@/components/layout/store-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { StoreProvider } from "@/contexts/store-context";
import { getStoreBySlug } from "@/services/stores";

interface StoreLayoutProps {
  children: React.ReactNode;
}

const StoreLayout = ({ children }: StoreLayoutProps) => {
  const router = useRouter();

  const { slug } = useParams() as { slug: string };

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadStore() {
      setIsLoading(true);
      setErrorStatus(null);

      try {
        const storeData = await getStoreBySlug(slug);

        if (!ignore) setStore(storeData);
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setErrorStatus(error.code);
          } else {
            setErrorStatus(500);
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
  }, [slug, refreshKey]);

  if (isLoading) {
    return (
      <>
        <StoreHeader />

        <LoadingIndicator message="Carregando loja..." className="min-h-[80vh]" />

        <Footer />
      </>
    );
  }

  if (errorStatus === 404 || !store) {
    return (
      <>
        <StoreHeader />

        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white text-indigo-600 shadow-2xl shadow-indigo-100">
            <Store size={48} />
          </div>

          <h1 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic md:text-7xl">
            Loja não <span className="text-indigo-600">Encontrada.</span>
          </h1>

          <p className="mt-6 max-w-xs text-xs leading-relaxed font-bold tracking-[0.2em] text-slate-400 uppercase">
            A loja que você procura não existe ou foi removido de nossa plataforma.
          </p>

          <button
            onClick={() => router.push("/")}
            className="group mt-10 flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black tracking-[0.3em] text-white uppercase transition-all hover:bg-indigo-600"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-2" />
            Voltar ao Início
          </button>
        </main>

        <Footer />
      </>
    );
  }

  if (errorStatus) {
    return (
      <>
        <StoreHeader />

        <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
          <div className="mb-8 text-red-500">
            <AlertCircle size={64} />
          </div>

          <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
            Erro de <span className="text-red-500">Conexão</span>
          </h2>

          <p className="mt-4 text-xs font-bold tracking-widest text-slate-400 uppercase">
            Não foi possível carregar os dados da loja.
          </p>

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="mt-8 flex items-center gap-2 rounded-xl bg-slate-100 px-8 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-colors hover:bg-slate-200"
          >
            <RefreshCcw size={14} />
            Tentar Novamente
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <StoreProvider store={store}>
      <StoreHeader store={store} />

      {children}

      <Footer />
    </StoreProvider>
  );
};

export default StoreLayout;
