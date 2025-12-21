"use client";

import { ArrowRight, CheckCircle2, Store } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";

export const ResetPasswordForm = () => {
  const [isReset, setIsReset] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReset(true);
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
          ACESSAR DASHBOARD
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 text-left">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Nova Senha
          </label>
          <PasswordField
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
          />
        </div>

        <div className="space-y-2 text-left">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Confirmar Senha
          </label>
          <PasswordField
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData({
                ...formData,
                confirmPassword: value,
              })
            }
          />
        </div>

        <ActionButton label="ATUALIZAR SENHA" variant="dark" size="sm" />
      </form>
    </div>
  );
};
