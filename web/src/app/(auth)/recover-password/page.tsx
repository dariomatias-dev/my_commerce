"use client";

import { ArrowRight, CheckCircle2, Mail, Store } from "lucide-react";
import React, { useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function RecoverPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <>
      <Header />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 font-sans text-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-5%] right-[-5%] h-[60%] w-[50%] rounded-full bg-indigo-50/50 opacity-60 blur-[120px]" />
          <div className="absolute bottom-[-5%] left-[-5%] h-[50%] w-[40%] rounded-full bg-violet-50/40 opacity-60 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />

          <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-slate-100 to-transparent" />
          <div className="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-transparent via-slate-100 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] md:p-14">
            {!emailSent ? (
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

                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-2xl bg-slate-950 py-4 text-xs font-black tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      ENVIAR INSTRUÇÕES
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                    <div className="absolute inset-0 translate-y-full bg-indigo-600 transition-transform duration-300 group-hover:translate-y-0" />
                  </button>
                </form>
              </div>
            ) : (
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
            )}
          </div>

          <p className="mt-8 text-center text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase italic">
            Segurança Protegida pelo MyEcommerce
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
