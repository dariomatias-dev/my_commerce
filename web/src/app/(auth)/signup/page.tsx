"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 lg:flex-row">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-16 lg:flex lg:w-1/2">
        <div className="pointer-events-none absolute top-0 right-0 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute right-0 bottom-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px]" />

        <div className="relative z-10">
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="rounded-xl bg-indigo-600 p-2 transition-transform group-hover:rotate-12">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              My<span className="text-indigo-500">Ecommerce</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="mb-8 text-6xl leading-none font-black tracking-tighter text-white italic xl:text-8xl">
            SEU PRÓXIMO <br /> <span className="text-indigo-500">CAPÍTULO</span>{" "}
            <br /> COMEÇA AQUI.
          </h1>
          <div className="max-w-md space-y-6">
            {[
              "Criação de loja em 2 minutos",
              "Sem taxas sobre faturamento",
              "Suporte especializado 24/7",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 font-medium text-slate-400 italic"
              >
                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-8">
          <p className="text-sm font-black tracking-widest text-slate-500 uppercase italic opacity-50">
            Junte-se a +15.000 lojistas vitoriosos
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center bg-white p-8 lg:p-16 xl:p-24">
        <div className="mb-12 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-black tracking-tighter uppercase italic">
              MyEcommerce
            </span>
          </div>
          <Link
            href="/"
            className="text-slate-400 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
              <Sparkles size={12} className="text-indigo-600" />
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                Start your journey
              </span>
            </div>
            <h2 className="mb-2 text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
              Criar Conta.
            </h2>
            <p className="font-medium tracking-tight text-slate-500">
              Preencha os dados abaixo para iniciar sua loja grátis.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Nome Completo
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Silva"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
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
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Senha
              </label>
              <PasswordField
                value={formData.password}
                onChange={(value) =>
                  setFormData({ ...formData, password: value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Confirmar Senha
              </label>
              <PasswordField
                value={formData.confirmPassword}
                onChange={(value) =>
                  setFormData({ ...formData, confirmPassword: value })
                }
              />
            </div>

            <ActionButton label="CRIAR MINHA CONTA" />
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-slate-500">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="text-indigo-600 decoration-2 underline-offset-4 hover:underline"
              >
                Fazer Login
              </Link>
            </p>
          </div>

          <div className="mt-12 border-t border-slate-50 pt-8 text-center">
            <p className="text-[10px] leading-relaxed font-black tracking-[0.2em] text-slate-300 uppercase">
              Ao continuar, você concorda com nossos <br />
              <Link
                href="/terms"
                className="text-slate-400 transition-colors hover:text-indigo-600"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="text-slate-400 transition-colors hover:text-indigo-600"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="absolute top-8 right-8 hidden items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-all hover:gap-4 hover:text-indigo-600 lg:flex"
      >
        <ArrowLeft size={14} /> Voltar para o Início
      </Link>
    </div>
  );
}
