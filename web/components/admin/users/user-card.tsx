"use client";

import { Circle, Edit3, Mail, Store, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { useUser } from "@/services/hooks/use-user";

interface UserCardProps {
  user: AdminUserResponse;
  onDeleteSuccess: () => void;
}

export const UserCard = ({ user, onDeleteSuccess }: UserCardProps) => {
  const router = useRouter();
  const { deleteUser } = useUser();

  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProceedToFinalDelete = () => {
    setIsFirstConfirmOpen(false);
    setIsSecondConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteUser(user.id);
      onDeleteSuccess();
    } finally {
      setIsDeleting(false);
      setIsSecondConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="group relative flex items-center justify-between rounded-[2.5rem] border border-slate-100 bg-white p-8 transition-all hover:border-indigo-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-slate-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <User size={28} />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg border-4 border-white ${
                user.enabled ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <Circle size={8} className="fill-white text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                {user.name}
              </h3>
              <span
                className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
                  user.deletedAt == null
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {user.deletedAt == null ? "Ativo" : "Removido"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Mail size={14} />
              <span className="text-[10px] font-bold tracking-widest text-slate-500">
                {user.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="mr-2 rounded-full bg-slate-50 px-5 py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {user.role}
            </span>
          </div>

          {user.role === "SUBSCRIBER" && (
            <button
              onClick={() => router.push(`/admin/users/${user.id}/stores`)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
              title="Visualizar Lojas"
            >
              <Store size={20} />
            </button>
          )}

          <button
            onClick={() => router.push(`/admin/users/${user.id}/edit`)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-950 hover:text-white"
            title="Editar Usuário"
          >
            <Edit3 size={20} />
          </button>

          <button
            onClick={() => setIsFirstConfirmOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-400 transition-all hover:bg-red-500 hover:text-white"
            title="Remover Usuário"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isFirstConfirmOpen}
        onClose={() => setIsFirstConfirmOpen(false)}
        onConfirm={handleProceedToFinalDelete}
        variant="danger"
        title="Remover usuário?"
        description={`Você está iniciando o processo de remoção de "${user.name}". Esta ação revogará todos os acessos imediatamente.`}
        confirmText="Sim, prosseguir"
      />

      <DeleteConfirmationDialog
        isOpen={isSecondConfirmOpen}
        onClose={() => setIsSecondConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Confirmar Exclusão Definitiva"
        description="Esta ação não pode ser desfeita. Para confirmar, digite o nome do usuário abaixo."
        confirmationName={user.name}
      />
    </>
  );
};
