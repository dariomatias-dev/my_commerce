"use client";

import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function RecoverPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 font-sans text-slate-900">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-indigo-50 opacity-60 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-violet-50 opacity-60 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-12 flex justify-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="rounded-xl bg-slate-950 p-2 shadow-xl shadow-slate-200 transition-transform group-hover:rotate-12">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              My<span className="text-indigo-600">Ecommerce</span>
            </span>
          </Link>
        </div>

        <div className="rounded-[4rem] border border-slate-100 bg-white p-10 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] md:p-20">
          {!emailSent ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2">
                <ShieldCheck size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Recuperação de Acesso
                </span>
              </div>

              <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-slate-950 uppercase italic md:text-6xl">
                ESQUECEU A <br />{" "}
                <span className="text-indigo-600">SENHA?</span>
              </h1>

              <p className="mb-10 text-lg leading-relaxed font-medium text-slate-500">
                Não se preocupe. Insira seu e-mail abaixo e enviaremos as
                instruções para você redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Seu E-mail Cadastrado
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-slate-300 transition-colors group-focus-within:text-indigo-600">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full rounded-3xl border border-slate-100 bg-slate-50 py-5 pr-4 pl-14 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-[2rem] bg-indigo-600 py-6 text-xl font-black text-white shadow-xl transition-all hover:bg-indigo-700 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    RECUPERAR ACESSO{" "}
                    <ArrowRight
                      size={24}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                  <div className="absolute inset-0 translate-y-full bg-slate-950 transition-transform duration-300 group-hover:translate-y-0" />
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-8 flex justify-center">
                <div className="rounded-full bg-emerald-50 p-6">
                  <CheckCircle2 size={64} className="text-emerald-500" />
                </div>
              </div>
              <h2 className="mb-6 text-4xl leading-none font-black tracking-tighter text-slate-950 uppercase italic">
                E-MAIL <span className="text-emerald-500">ENVIADO.</span>
              </h2>
              <p className="mb-10 text-lg leading-relaxed font-medium text-slate-500">
                Verifique a caixa de entrada de{" "}
                <span className="font-bold text-slate-900">{email}</span>.{" "}
                <br />
                Não esqueça de checar a pasta de spam.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="text-xs font-black tracking-[0.3em] text-indigo-600 uppercase transition-colors hover:text-indigo-700"
              >
                Tentar outro e-mail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
