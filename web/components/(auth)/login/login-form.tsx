"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ApiError } from "@/@types/api";
import { ActionButton } from "@/components/buttons/action-button";
import { PasswordField } from "@/components/password-field";
import { useAuthContext } from "@/contexts/auth-context";
import { loginSchema } from "@/schemas/login.schema";
import { useAuth } from "@/services/hooks/use-auth";

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();

  const { login } = useAuth();

  const { user, refreshUser } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setGlobalError(null);

      const response = await login(data);

      Cookies.set("token", response.accessToken, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", response.refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      await refreshUser();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          error.errors.forEach((err) => {
            setError(err.field as keyof LoginFormValues, {
              message: err.error,
            });
          });
        } else {
          setGlobalError(error.message);
        }
      } else {
        setGlobalError("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case "SUBSCRIBER":
        router.push("/dashboard");
        break;
      case "ADMIN":
        router.push("/admin");
        break;
      default:
        router.push("/settings");
    }
  }, [user, router]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {globalError && (
        <div className="animate-in fade-in zoom-in-95 rounded-xl bg-red-50 p-4 text-center duration-300">
          <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
            {globalError}
          </p>
        </div>
      )}

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
            disabled={isLoading}
            placeholder="seu@email.com"
            className={`w-full rounded-2xl border bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none disabled:opacity-50 ${
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

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Senha
          </label>

          <Link
            href="/recover-password"
            title="Esqueceu a senha?"
            className="text-[10px] font-black tracking-widest text-indigo-600 uppercase transition-colors hover:text-indigo-700"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <PasswordField
          {...register("password")}
          disabled={isLoading}
          error={errors.password?.message}
        />
      </div>

      <ActionButton disabled={isLoading} showArrow={!isLoading}>
        {isLoading ? "ENTRANDO..." : "ENTRAR"}
      </ActionButton>
    </form>
  );
};
