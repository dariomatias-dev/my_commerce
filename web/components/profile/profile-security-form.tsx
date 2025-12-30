"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { PasswordField } from "@/components/password-field";
import { passwordSchema } from "@/schemas/password.schema";
import { useUser } from "@/services/hooks/use-user";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ProfileSecurityFormProps {
  setFeedback: (
    feedback: { message: string; type: "success" | "error" } | null
  ) => void;
}

export const ProfileSecurityForm = ({
  setFeedback,
}: ProfileSecurityFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { changePassword } = useUser();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);

      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      form.reset();

      setFeedback({ message: "Senha alterada com sucesso.", type: "success" });
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error ? error.message : "Erro ao alterar senha.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Senha Atual
            </label>
            <PasswordField
              {...form.register("currentPassword")}
              error={form.formState.errors.currentPassword?.message}
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Nova Senha
            </label>
            <PasswordField
              {...form.register("newPassword")}
              error={form.formState.errors.newPassword?.message}
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Confirmar Senha
            </label>
            <PasswordField
              {...form.register("confirmPassword")}
              error={form.formState.errors.confirmPassword?.message}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              "ATUALIZAR SENHA"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
