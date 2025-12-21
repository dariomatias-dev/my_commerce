"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, Store } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ActionButton } from "@/components/buttons/action-button";
import { useAuth } from "@/hooks/use-auth";
import { recoverSchema } from "@/schemas/recover.schema";

type RecoverFormValues = z.infer<typeof recoverSchema>;

export const RecoverPasswordForm = () => {
  const { recoverPassword } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RecoverFormValues) => {
    try {
      setIsLoading(true);
      setApiError(null);

      await recoverPassword({ email: data.email });

      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch (error: any) {
      setApiError(error.message || "Erro ao solicitar recuperação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmailSent(false);
    setApiError(null);
    reset();
  };

  if (emailSent) {
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
        <p className="mb-10 px-4 text-sm leading-relaxed font-medium text-slate-500">
          Enviamos um link de recuperação para <br />
          <span className="font-bold text-slate-900 underline decoration-emerald-200 decoration-2">
            {submittedEmail}
          </span>
          .
        </p>

        <button
          onClick={handleReset}
          className="rounded-full border border-slate-100 bg-white px-8 py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-all hover:border-indigo-600 hover:text-indigo-600"
        >
          Tentar outro e-mail
        </button>
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
          RECUPERAR <span className="text-indigo-600">ACESSO.</span>
        </h1>
        <p className="text-sm leading-relaxed font-medium text-slate-500">
          Insira seu e-mail abaixo e enviaremos as{" "}
          <br className="hidden md:block" />
          instruções para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="rounded-xl bg-red-50 p-4 text-center">
            <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
              {apiError}
            </p>
          </div>
        )}

        <div className="space-y-2 text-left">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            E-mail Cadastrado
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
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/5"
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
          showArrow={!isLoading}
          disabled={isLoading}
        >
          {isLoading ? "ENVIANDO..." : "ENVIAR INSTRUÇÕES"}
        </ActionButton>
      </form>
    </div>
  );
};
