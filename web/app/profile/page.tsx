"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";
import { PasswordField } from "@/components/password-field";
import { useAuthContext } from "@/contexts/auth-context";
import { useUser } from "@/hooks/use-user";

const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.email("E-mail inválido"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuthContext();
  const { updateMe, changePassword, deleteMe } = useUser();

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      setIsLoadingProfile(true);

      await updateMe(data);

      await refreshUser();

      setFeedback({
        message: "Perfil atualizado com sucesso.",
        type: "success",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar perfil.";

      setFeedback({
        message,
        type: "error",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onUpdatePassword = async (data: PasswordFormValues) => {
    try {
      setIsLoadingPassword(true);

      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      passwordForm.reset();

      setFeedback({
        message: "Senha alterada com sucesso.",
        type: "success",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao alterar senha.";

      setFeedback({
        message,
        type: "error",
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <DashboardHeader />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-12">
        <div className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
            MEU <span className="text-indigo-600">PERFIL.</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-400 uppercase italic">
            Gerencie suas credenciais e preferências de segurança.
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-8 flex items-center gap-3 rounded-2xl p-4 animate-in fade-in zoom-in-95 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <ShieldAlert size={20} />
            )}
            <p className="text-xs font-black uppercase tracking-widest">
              {feedback.message}
            </p>
          </div>
        )}

        <div className="grid gap-8">
          <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
                  Informações Pessoais
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Dados básicos da sua conta
                </p>
              </div>
            </div>

            <form
              onSubmit={profileForm.handleSubmit(onUpdateProfile)}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Nome Completo
                  </label>
                  <input
                    {...profileForm.register("name")}
                    className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3.5 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-[9px] font-black text-red-500 uppercase">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    E-mail Corporativo
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <input
                      {...profileForm.register("email")}
                      disabled
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 font-bold text-slate-400 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  disabled={isLoadingProfile}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 disabled:opacity-50"
                >
                  {isLoadingProfile ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    "SALVAR ALTERAÇÕES"
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600">
                <KeyRound size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
                  Segurança
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Atualizar senha de acesso
                </p>
              </div>
            </div>

            <form
              onSubmit={passwordForm.handleSubmit(onUpdatePassword)}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Senha Atual
                  </label>
                  <PasswordField
                    {...passwordForm.register("oldPassword")}
                    error={passwordForm.formState.errors.oldPassword?.message}
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Nova Senha
                  </label>
                  <PasswordField
                    {...passwordForm.register("newPassword")}
                    error={passwordForm.formState.errors.newPassword?.message}
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Confirmar Senha
                  </label>
                  <PasswordField
                    {...passwordForm.register("confirmPassword")}
                    error={
                      passwordForm.formState.errors.confirmPassword?.message
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  disabled={isLoadingPassword}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 disabled:opacity-50"
                >
                  {isLoadingPassword ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    "ATUALIZAR SENHA"
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[2.5rem] border border-red-100 bg-red-50/30 p-8 md:p-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-red-600 uppercase italic">
                    Excluir Conta
                  </h2>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                    Esta ação é irreversível e apagará todas as suas lojas
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Tem certeza? Todos os dados de suas lojas serão deletados permanentemente."
                    )
                  )
                    deleteMe();
                }}
                className="rounded-xl border-2 border-red-600 px-8 py-3 text-[10px] font-black tracking-widest text-red-600 uppercase transition-all hover:bg-red-600 hover:text-white"
              >
                APAGAR MINHA CONTA
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
