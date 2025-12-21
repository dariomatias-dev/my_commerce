"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";
import { passwordSchema } from "@/schemas/password.schema";

export const loginSchema = z.object({
  email: z.email("Insira um e-mail válido"),
  password: passwordSchema,
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          E-mail
        </label>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
            <Mail size={18} />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="seu@email.com"
            className={`w-full rounded-2xl border bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none ${
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

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Senha
          </label>
          <Link
            href="/recover-password"
            className="text-[10px] font-black tracking-widest text-indigo-600 uppercase transition-colors hover:text-indigo-700"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <PasswordField
          {...register("password")}
          error={errors.password?.message}
        />
      </div>

      <ActionButton label="ENTRAR" />
    </form>
  );
};
