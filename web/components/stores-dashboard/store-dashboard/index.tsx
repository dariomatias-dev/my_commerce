"use client";

import { Eye, List, PackagePlus, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { DashboardStoreStats } from "@/components/dashboard/store/[slug]/dashboard-store-stats";
import { InventoryAlert } from "@/components/dashboard/store/[slug]/inventory-alert";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { ProductsDashboard } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/products-dashboard";
import { useStore } from "@/services/hooks/use-store";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";

interface StoreDashboardProps {
  storeSlug: string;
  basePath: string;
  backLabel: string;
  canCreate?: boolean;
}

export const StoreDashboard = ({
  storeSlug,
  basePath,
  backLabel,
  canCreate = true,
}: StoreDashboardProps) => {
  const router = useRouter();
  const { deleteStore, getStoreBySlug } = useStore();

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStoreData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getStoreBySlug(storeSlug);

      setStore(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Erro ao carregar dados do console.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeSlug, getStoreBySlug]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  const handleOpenDelete = () => setIsFirstConfirmOpen(true);
  const handleCloseFirstConfirm = () => setIsFirstConfirmOpen(false);

  const handleProceedToFinalDelete = () => {
    setIsFirstConfirmOpen(false);
    setIsSecondConfirmOpen(true);
  };

  const handleCloseSecondConfirm = () => {
    if (isDeleting) return;

    setIsSecondConfirmOpen(false);
  };

  const handleConfirmDeleteStore = async () => {
    if (!store) return;

    try {
      setIsDeleting(true);

      await deleteStore(store.id);

      router.push(basePath);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível excluir a loja.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Carregando dados..." />;
  }

  if (error || !store) {
    return (
      <ErrorFeedback
        title="Console"
        highlightedTitle="Indisponível"
        errorMessage={error}
        onRetry={fetchStoreData}
        backPath={basePath}
        backLabel={backLabel}
      />
    );
  }

  return (
    <main className="min-h-screen pb-12 pt-32 lg:px-6">
      <div className="mx-auto max-w-400 animate-in fade-in zoom-in-95 duration-500 px-6">
        <DashboardPageHeader
          backPath={basePath}
          label={`${store.isActive ? "OPERACIONAL" : "OFFLINE"} — ID: ${store.id
            .slice(0, 8)
            .toUpperCase()}-SECURED`}
          title={`CONSOLE ${store.name}`}
          subtitle={`Gerenciamento centralizado da unidade comercial ${store.name}.`}
          actions={
            <>
              <Link
                href={`${storeSlug}/products`}
                className="flex items-center justify-center gap-3 rounded-xl border border-slate-950 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-slate-50"
              >
                <Eye size={16} /> VER VITRINE
              </Link>

              <Link
                href={`${storeSlug}/edit`}
                className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 hover:text-indigo-600"
              >
                <Settings size={16} /> EDITAR LOJA
              </Link>

              <button
                onClick={handleOpenDelete}
                className="flex items-center justify-center gap-3 rounded-xl border border-red-100 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-red-500 uppercase transition-all hover:bg-red-50"
              >
                <Trash2 size={16} /> EXCLUIR
              </button>
            </>
          }
        />

        <DashboardStoreStats storeId={store.id} isActive={store.isActive} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-10">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm">
              <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                    <List size={24} />
                  </div>

                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
                    Catálogo de{" "}
                    <span className="text-indigo-600">Produtos.</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {canCreate && (
                    <Link
                      href={`${storeSlug}/products/new`}
                      className="flex items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600"
                    >
                      <PackagePlus size={16} /> NOVO
                    </Link>
                  )}

                  <Link
                    href={`${storeSlug}/products`}
                    className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50"
                  >
                    VER TUDO
                  </Link>
                </div>
              </div>

              <ProductsDashboard storeId={store.id} basePath={`${basePath}/${storeSlug}`} />
            </div>
          </div>

          <InventoryAlert storeId={store.id} />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isFirstConfirmOpen}
        onClose={handleCloseFirstConfirm}
        onConfirm={handleProceedToFinalDelete}
        variant="danger"
        title="Encerrar Loja?"
        description={`Você está prestes a desativar permanentemente a loja "${store.name}". Esta ação não pode ser desfeita.`}
        confirmText="Sim, prosseguir"
      />

      <DeleteConfirmationDialog
        isOpen={isSecondConfirmOpen}
        onClose={handleCloseSecondConfirm}
        onConfirm={handleConfirmDeleteStore}
        isLoading={isDeleting}
        title="Confirmar Exclusão Definitiva"
        description="Ao confirmar, todos os produtos, categorias, mídias e logs de transação desta loja serão removidos permanentemente."
        confirmationName={store.name}
      />
    </main>
  );
};
