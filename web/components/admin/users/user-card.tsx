"use client";

import {
  Briefcase,
  Edit3,
  LucideIcon,
  Mail,
  ShieldCheck,
  Store,
  Trash2,
  User,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { cn } from "@/lib/utils";
import { useUser } from "@/services/hooks/use-user";

interface UserCardProps {
  user: AdminUserResponse;
  onDeleteSuccess: () => void;
}

interface RoleStyle {
  bg: string;
  text: string;
  icon: LucideIcon;
  label: string;
}

const roleStyles: Record<string, RoleStyle> = {
  ADMIN: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    icon: ShieldCheck,
    label: "Administrador",
  },
  SUBSCRIBER: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: Briefcase,
    label: "Assinante",
  },
  USER: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    icon: UserCircle,
    label: "Usuário",
  },
};

export const UserCard = ({ user, onDeleteSuccess }: UserCardProps) => {
  const router = useRouter();

  const { deleteUser } = useUser();

  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const style = roleStyles[user.role] || roleStyles.USER;
  const RoleIcon = style.icon;

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
      <div className="group relative flex flex-col gap-6 rounded-[2rem] border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white">
              <User size={28} />
            </div>

            <div
              className={cn(
                "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white",
                user.enabled ? "bg-emerald-500" : "bg-slate-300",
              )}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full bg-white ${user.enabled ? "animate-pulse" : ""}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900">
                {user.name}
              </h3>

              <span
                className={cn(
                  "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest",
                  user.deletedAt == null
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-500",
                )}
              >
                {user.deletedAt == null ? "• Conta Ativa" : "• Removido"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Mail size={14} className="text-slate-300" />

              <span className="text-[11px] font-bold tracking-wide text-slate-500">
                {user.email.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-50 pt-6 md:border-none md:pt-0 md:justify-end md:gap-4">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2",
              style.bg,
              style.text,
            )}
          >
            <RoleIcon size={14} />

            <span className="text-[10px] font-black uppercase tracking-widest">
              {style.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {user.role === "SUBSCRIBER" && (
              <button
                onClick={() => router.push(`/admin/users/${user.id}/stores`)}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                title="Stores"
              >
                <Store size={18} />
              </button>
            )}

            <button
              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
              title="Edit"
            >
              <Edit3 size={18} />
            </button>

            <button
              onClick={() => setIsFirstConfirmOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-rose-500 hover:text-white"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
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
