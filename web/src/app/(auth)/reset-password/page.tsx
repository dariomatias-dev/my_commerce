"use client";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  Store,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsReset(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 font-sans text-slate-900">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-5%] left-[-5%] h-[60%] w-[60%] rounded-full bg-indigo-50 opacity-60 blur-[140px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-violet-50 opacity-60 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-12 flex justify-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 shadow-2xl shadow-indigo-200 transition-transform group-hover:rotate-12">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              My<span className="text-indigo-600">Ecommerce</span>
            </span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[4rem] border border-slate-100 bg-white p-10 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] md:p-20">
          {!isReset ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2">
                <ShieldAlert size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">
                  Atualização de Credenciais
                </span>
              </div>

              <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-slate-950 uppercase italic md:text-6xl">
                CRIE SUA <br />{" "}
                <span className="text-indigo-600">NOVA SENHA.</span>
              </h1>

              <p className="mb-10 text-lg leading-relaxed font-medium text-slate-500">
                Escolha uma senha forte para garantir a <br /> máxima proteção
                da sua loja.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Nova Senha
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-slate-300 transition-colors group-focus-within:text-indigo-600">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-3xl border border-slate-100 bg-slate-50 py-5 pr-12 pl-14 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-300 transition-colors hover:text-indigo-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Confirmar Nova Senha
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-slate-300 transition-colors group-focus-within:text-indigo-600">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-3xl border border-slate-100 bg-slate-50 py-5 pr-4 pl-14 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-[2rem] bg-indigo-600 py-6 text-xl font-black text-white shadow-xl transition-all hover:bg-indigo-700 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    REDEFINIR SENHA{" "}
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
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <div className="mb-8 flex justify-center">
                <div className="rounded-full bg-indigo-600 p-6 shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
                  <CheckCircle2 size={64} className="text-white" />
                </div>
              </div>
              <h2 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-slate-950 uppercase italic md:text-6xl">
                SENHA <br />{" "}
                <span className="text-indigo-600">ATUALIZADA.</span>
              </h2>
              <p className="mb-12 text-lg leading-relaxed font-medium text-slate-500">
                Tudo pronto! Sua senha foi redefinida com sucesso. <br />
                Agora você pode acessar seu painel administrativo.
              </p>
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center gap-3 rounded-3xl bg-slate-950 px-12 py-6 text-xl font-black text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95"
              >
                ACESSAR PAINEL{" "}
                <ArrowRight
                  size={24}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
