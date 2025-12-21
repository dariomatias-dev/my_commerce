"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, MailCheck, RefreshCw, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";
import { useAuth } from "@/hooks/use-auth";
import { signupSchema } from "@/schemas/signup.schema";

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { signup, resendVerificationEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendFeedback, setResendFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      setApiError(null);

      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setRegisteredEmail(data.email);
      setIsSuccess(true);
      onSuccess();
    } catch (error: any) {
      setApiError(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setResendFeedback(null);
      await resendVerificationEmail({ email: registeredEmail });
      setResendFeedback({
        message: "E-mail reenviado com sucesso!",
        type: "success",
      });
    } catch (error: any) {
      setResendFeedback({
        message: error.message || "Erro ao reenviar e-mail.",
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in zoom-in-95 text-center duration-500">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-100 opacity-20" />
            <div className="relative rounded-full bg-indigo-50 p-6">
              <MailCheck size={48} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
          QUASE <span className="text-indigo-600">LÁ.</span>
        </h2>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed font-medium text-slate-500">
            Enviamos um link de ativação para: <br />
            <span className="font-bold text-slate-950 underline decoration-indigo-200 decoration-2">
              {registeredEmail}
            </span>
          </p>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-left">
            <p className="flex items-center gap-3 text-xs leading-relaxed font-bold text-slate-600">
              <CheckCircle2
                size={14}
                className="flex-shrink-0 text-indigo-500"
              />
              Verifique sua caixa de entrada e spam.
            </p>
            <p className="mt-3 flex items-center gap-3 text-xs leading-relaxed font-bold text-slate-600">
              <CheckCircle2
                size={14}
                className="flex-shrink-0 text-indigo-500"
              />
              Clique no botão para validar seu acesso.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white py-3 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-all hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isResending ? "animate-spin" : ""}
              />
              {isResending ? "Reenviando..." : "Reenviar e-mail de ativação"}
            </button>
            {resendFeedback && (
              <p
                className={`mt-2 text-[9px] font-bold tracking-wider uppercase ${
                  resendFeedback.type === "success"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {resendFeedback.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/login"
            className="text-[10px] font-black tracking-widest text-indigo-600 uppercase transition-colors hover:text-indigo-700"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
            {apiError}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          Nome Completo
        </label>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
            <User size={18} />
          </div>
          <input
            {...register("name")}
            type="text"
            disabled={isLoading}
            placeholder="Ex: João Silva"
            className={`w-full rounded-2xl border bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:outline-none disabled:opacity-50 ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/20"
            }`}
          />
        </div>
        {errors.name && (
          <p className="ml-1 text-[10px] font-bold tracking-wider text-red-500 uppercase">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          E-mail Corporativo
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
            className={`w-full rounded-2xl border bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:outline-none disabled:opacity-50 ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/20"
            }`}
          />
        </div>
        {errors.email && (
          <p className="ml-1 text-[10px] font-bold tracking-wider text-red-500 uppercase">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          Senha
        </label>
        <PasswordField
          {...register("password")}
          disabled={isLoading}
          error={errors.password?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          Confirmar Senha
        </label>
        <PasswordField
          {...register("confirmPassword")}
          disabled={isLoading}
          error={errors.confirmPassword?.message}
        />
      </div>

      <ActionButton
        label={isLoading ? "CRIANDO CONTA..." : "CRIAR MINHA CONTA"}
        disabled={isLoading}
      />
    </form>
  );
};
