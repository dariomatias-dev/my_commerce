"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { StoreCard } from "@/components/stores-list/dashboard-store-card";
import { useStore } from "@/services/hooks/use-store";
import { LoadingIndicator } from "../loading-indicator";

interface StoresListProps {
  stores: StoreResponse[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}

export const StoresList = ({
  stores,
  isLoading,
  errorMessage,
  onRetry,
}: StoresListProps) => {
  const { deleteStore } = useStore();

  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<StoreResponse | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleOpenFirstConfirm = (store: StoreResponse) => {
    setStoreToDelete(store);
    setIsFirstConfirmOpen(true);
  };

  const handleCloseFirstConfirm = () => {
    setIsFirstConfirmOpen(false);
    if (!isSecondConfirmOpen) setStoreToDelete(null);
  };

  const handleProceedToFinalDelete = () => {
    setIsFirstConfirmOpen(false);
    setIsSecondConfirmOpen(true);
  };

  const handleCloseSecondConfirm = () => {
    if (isDeleting) return;
    setIsSecondConfirmOpen(false);
    setStoreToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return;

    try {
      setIsDeleting(true);
      setActionError(null);

      await deleteStore(storeToDelete.id);

      setIsSecondConfirmOpen(false);
      setStoreToDelete(null);
      onRetry();
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message);
      } else {
        setActionError("Não foi possível remover a loja selecionada.");
      }
      setIsSecondConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Obtendo lojas..." />;
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-red-100 text-center px-6">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-red-50 text-red-500">
          <AlertCircle size={40} />
        </div>

        <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
          Falha na <span className="text-red-500">Conexão</span>
        </h3>

        <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-tight max-w-xs">
          {errorMessage}
        </p>

        <button
          onClick={onRetry}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600"
        >
          <RefreshCcw size={16} /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {actionError && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-red-500 shrink-0" size={18} />

            <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
              {actionError}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onDelete={() => handleOpenFirstConfirm(store)}
            />
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isFirstConfirmOpen}
        onClose={handleCloseFirstConfirm}
        onConfirm={handleProceedToFinalDelete}
        variant="danger"
        title="Remover Loja?"
        description={`Você está prestes a remover a loja "${storeToDelete?.name}". Esta ação precede a exclusão definitiva de todos os dados vinculados.`}
        confirmText="Sim, prosseguir"
      />

      <DeleteConfirmationDialog
        isOpen={isSecondConfirmOpen}
        onClose={handleCloseSecondConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Confirmar Exclusão"
        description="Esta é a última etapa. Ao confirmar, a loja, seus produtos e todos os registros de mídia serão removidos permanentemente."
        confirmationName={storeToDelete?.name || ""}
      />
    </>
  );
};
