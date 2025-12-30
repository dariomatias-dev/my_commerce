"use client";

import { ArrowRight, Pencil, StoreIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { StoreResponse } from "@/@types/store/store-response";
import { ConfirmDialog } from "../dialogs/confirm-dialog";

interface StoreCardProps {
  store: StoreResponse;
  onDelete: (id: string) => Promise<void>;
}

const StoreLogo = ({
  storeSlug,
  storeName,
}: {
  storeSlug: string;
  storeName: string;
}) => {
  const [error, setError] = useState(false);
  const logoUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stores/${storeSlug}/logo.jpeg`;

  if (error) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
        <StoreIcon size={32} />
      </div>
    );
  }

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
      <Image
        src={logoUrl}
        alt={storeName}
        fill
        unoptimized
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};

export const StoreCard = ({ store, onDelete }: StoreCardProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);

      await onDelete(store.id);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col items-start overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-9 text-left transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10">
        <div className="mb-8 flex w-full items-center justify-between">
          <StoreLogo storeSlug={store.slug} storeName={store.name} />

          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/store/${store.slug}/edit`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 transition-all hover:border-indigo-600 hover:text-indigo-600"
            >
              <Pencil size={18} />
            </Link>
            <button
              onClick={handleOpenConfirm}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 transition-all hover:border-red-600 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="mb-2">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black tracking-widest uppercase ${
              store.isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                store.isActive
                  ? "animate-pulse bg-emerald-500"
                  : "bg-orange-500"
              }`}
            />
            {store.isActive ? "ATIVA" : "INATIVA"}
          </div>
        </div>

        <h3 className="text-3xl leading-none font-black tracking-tighter text-slate-950 uppercase italic">
          {store.name}
        </h3>
        <p className="mt-3 text-xs font-bold tracking-widest text-slate-400">
          {store.slug}
        </p>

        <Link
          href={`/dashboard/store/${store.slug}`}
          className="mt-12 flex w-full items-center justify-between border-t border-slate-50 pt-6"
        >
          <div>
            <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
              Controle
            </p>
            <p className="text-lg font-black text-slate-950 italic uppercase tracking-tighter">
              Gerenciamento da Loja
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-all group-hover:bg-indigo-600 group-hover:translate-x-1">
            <ArrowRight size={22} />
          </div>
        </Link>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="danger"
        title="Remover Loja"
        description={`Você está prestes a remover permanentemente a loja "${store.name}". Esta ação não poderá ser desfeita.`}
        confirmText="Remover"
      />
    </>
  );
};
