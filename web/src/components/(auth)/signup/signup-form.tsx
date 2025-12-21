"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";
import { passwordSchema } from "@/schemas/password.schema";

const signupSchema = z
  .object({
    name: z.string().min(3, "Insira seu nome completo"),
    email: z.email("Insira um e-mail válido"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = () => {
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

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            placeholder="Ex: João Silva"
            className={`w-full rounded-2xl border bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:outline-none ${
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
            placeholder="seu@email.com"
            className={`w-full rounded-2xl border bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:outline-none ${
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
          error={errors.password?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          Confirmar Senha
        </label>
        <PasswordField
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <ActionButton label="CRIAR MINHA CONTA" />
    </form>
  );
};
