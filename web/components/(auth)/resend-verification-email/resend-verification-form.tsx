"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, RefreshCw, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ApiError } from "@/@types/api";
import { ActionButton } from "@/components/buttons/action-button";
import { useAuth } from "@/services/hooks/use-auth";

const resendSchema = z.object({
  email: z.email("Insira um e-mail válido"),
});

type ResendFormValues = z.infer<typeof resendSchema>;

export const ResendVerificationForm = () => {
  const { resendVerificationEmail } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ResendFormValues) => {
    try {
      setIsLoading(true);
      setApiError(null);
      await resendVerificationEmail({ email: data.email });
      setLastEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors && error.errors.length > 0) {
          error.errors.forEach((fError) => {
            setError(fError.field as keyof ResendFormValues, {
              message: fError.error,
            });
          });
        } else {
          setApiError(error.message);
        }
      } else {
        setApiError("Erro ao solicitar reenvio. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in zoom-in-95 text-center duration-500">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-20" />
            <div className="relative rounded-full bg-emerald-50 p-6">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
          E-MAIL <span className="text-emerald-500">ENVIADO.</span>
        </h2>
        <p className="mb-10 text-sm leading-relaxed font-medium text-slate-500">
          Um novo link de ativação foi enviado para: <br />
          <span className="font-bold text-slate-900 underline decoration-emerald-200 decoration-2">
            {lastEmail}
          </span>
        </p>
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 py-4 text-xs font-black tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95"
        >
          VOLTAR AO LOGIN
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex justify-center">
        <div className="rounded-xl bg-slate-950 p-2 shadow-lg shadow-slate-200">
          <Store className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic md:text-4xl">
          REENVIAR <span className="text-indigo-600">ATIVAÇÃO.</span>
        </h1>
        <p className="text-sm leading-relaxed font-medium text-slate-500">
          Não recebeu o e-mail de confirmação? <br />
          Insira seu endereço abaixo para solicitar um novo link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="animate-in fade-in zoom-in-95 rounded-xl bg-red-50 p-4 text-center">
            <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
              {apiError}
            </p>
          </div>
        )}

        <div className="space-y-2 text-left">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            E-mail de Cadastro
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
              <Mail size={18} />
            </div>
            <input
              {...register("email")}
              type="email"
              disabled={isLoading}
              placeholder="seu@email.com"
              className={`w-full rounded-2xl border bg-slate-50 py-4 pr-4 pl-12 text-sm font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none disabled:opacity-50 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/5"
                  : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/5"
              }`}
            />
          </div>
          {errors.email && (
            <p className="ml-1 text-[10px] font-bold tracking-wider text-red-500 uppercase">
              {errors.email.message}
            </p>
          )}
        </div>

        <ActionButton
          variant="dark"
          size="sm"
          disabled={isLoading}
          showArrow={!isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin" /> PROCESSANDO...
            </span>
          ) : (
            "SOLICITAR NOVO LINK"
          )}
        </ActionButton>
      </form>
    </div>
  );
};
