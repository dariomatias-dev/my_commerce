"use client";

import { CheckCircle2, Mail, Store } from "lucide-react";
import React, { useState } from "react";

import { ActionButton } from "@/components/action-button";

export const RecoverPasswordForm = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
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
            {email}
          </span>
          .
        </p>

        <button
          onClick={() => setEmailSent(false)}
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 text-left">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            E-mail Cadastrado
          </label>
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-4 pl-12 text-sm font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
            />
          </div>
        </div>

        <ActionButton label="ENVIAR INSTRUÇÕES" variant="dark" size="sm" />
      </form>
    </div>
  );
};
