"use client";

import {
  ArrowLeft,
  Chrome,
  Github,
  Mail,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentativa de login:", formData);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 lg:flex-row">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-16 lg:flex lg:w-1/2">
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute top-[-10%] right-[-10%] h-full w-full rounded-full bg-indigo-600/10 blur-[120px]" />

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
          <h1 className="mb-8 text-7xl leading-[0.85] font-black tracking-tighter text-white uppercase italic xl:text-9xl">
            BEM-VINDO <br /> <span className="text-indigo-500">DE VOLTA.</span>
          </h1>
          <p className="max-w-sm text-xl leading-relaxed font-medium text-slate-400 italic">
            Acesse seu painel e continue expandindo seu império digital hoje
            mesmo.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase italic opacity-50">
          <ShieldCheck size={16} className="text-indigo-500" />
          Conexão Segura & Criptografada
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center bg-white p-8 lg:p-16 xl:p-24">
        <Link
          href="/"
          className="absolute top-8 right-8 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-all hover:gap-4 hover:text-indigo-600"
        >
          <ArrowLeft size={14} /> Voltar ao Início
        </Link>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-12">
            <h2 className="mb-2 text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
              Login.
            </h2>
            <p className="font-medium text-slate-500">
              Insira suas credenciais para acessar o sistema.
            </p>
          </div>

          <div className="mb-10 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 py-4 text-xs font-bold tracking-widest uppercase transition-all hover:bg-slate-50 active:scale-95">
              <Chrome size={16} /> Google
            </button>
            <button className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 py-4 text-xs font-bold tracking-widest uppercase transition-all hover:bg-slate-50 active:scale-95">
              <Github size={16} /> GitHub
            </button>
          </div>

          <div className="relative mb-10 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-4 text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase italic">
              Ou use seu e-mail
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                E-mail
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Senha
                </label>
                <Link
                  href="/forgot"
                  className="text-[10px] font-black tracking-widest text-indigo-600 uppercase transition-colors hover:text-indigo-700"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <PasswordField
                value={formData.password}
                onChange={(value) =>
                  setFormData({ ...formData, password: value })
                }
              />
            </div>

            <ActionButton label="ENTRAR" />
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm font-bold text-slate-500 italic">
              Ainda não tem uma conta?{" "}
              <Link
                href="/signup"
                className="text-indigo-600 decoration-2 underline-offset-4 hover:underline"
              >
                Criar sua conta grátis
              </Link>
            </p>
          </div>

          <div className="mt-16 text-center opacity-30">
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">
              Powered by MyEcommerce SaaS 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
