"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Store } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ApiError } from "@/@types/api";
import { ActionButton } from "@/components/buttons/action-button";
import { PasswordField } from "@/components/password-field";
import { useAuth } from "@/services/hooks/use-auth";
import { resetPasswordSchema } from "@/schemas/reset-password.schema";

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { resetPassword } = useAuth();

  const [isReset, setIsReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      setApiError("Token de redefinição inválido ou ausente.");
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      await resetPassword({
        token,
        newPassword: data.password,
      });

      setIsReset(true);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors && error.errors.length > 0) {
          error.errors.forEach((fError) => {
            setError(fError.field as keyof ResetPasswordValues, {
              type: "server",
              message: fError.error,
            });
          });
        } else {
          setApiError(error.message);
        }
      } else {
        setApiError("Erro ao atualizar senha. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <div className="animate-in fade-in zoom-in-95 text-center duration-500">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-100 opacity-20" />
            <div className="relative rounded-full bg-indigo-600 p-6 shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
              <CheckCircle2 size={48} className="text-white" />
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
          SENHA <span className="text-indigo-600">REDEFINIDA.</span>
        </h2>

        <p className="mb-10 px-4 text-sm leading-relaxed font-medium text-slate-500">
          Sua segurança foi atualizada com sucesso.
          <br />
          Acesse sua conta para continuar vendendo.
        </p>

        <Link
          href="/login"
          className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-10 py-4 text-xs font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95"
        >
          ACESSAR CONSOLE
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex justify-center">
        <div className="rounded-xl bg-slate-950 p-2 shadow-lg shadow-slate-200">
          <Store className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic md:text-4xl">
          NOVA <span className="text-indigo-600">SENHA.</span>
        </h1>
        <p className="text-sm leading-relaxed font-medium text-slate-500">
          Escolha uma combinação forte para
          <br className="hidden md:block" />
          garantir a proteção das suas lojas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="animate-in fade-in zoom-in-95 rounded-xl bg-red-50 p-4 text-center duration-300">
            <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
              {apiError}
            </p>
          </div>
        )}

        {!token && (
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-[10px] font-black tracking-widest text-amber-600 uppercase">
              Aviso: Nenhum token detectado na URL
            </p>
          </div>
        )}

        <div className="space-y-2 text-left">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Nova Senha
          </label>
          <PasswordField
            {...register("password")}
            disabled={isLoading || !token}
            error={errors.password?.message}
          />
        </div>

        <div className="space-y-2 text-left">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Confirmar Senha
          </label>
          <PasswordField
            {...register("confirmPassword")}
            disabled={isLoading || !token}
            error={errors.confirmPassword?.message}
          />
        </div>

        <ActionButton
          variant="dark"
          size="sm"
          showArrow={!isLoading}
          disabled={isLoading || !token}
        >
          {isLoading ? "PROCESSANDO..." : "ATUALIZAR SENHA"}
        </ActionButton>
      </form>
    </div>
  );
};
