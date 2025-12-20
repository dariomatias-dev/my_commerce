"use client";

import { ArrowRight, RefreshCw, Sparkles, Store } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";

export default function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => setIsResending(false), 2000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 font-sans text-slate-900">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-50 opacity-60 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-violet-50 opacity-60 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-16 flex justify-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 shadow-lg shadow-indigo-100 transition-transform group-hover:rotate-12">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              My<span className="text-indigo-600">Ecommerce</span>
            </span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[4rem] border border-slate-100 bg-white p-10 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] md:p-20">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">
              Verificação de Segurança
            </span>
          </div>

          <div className="mb-10">
            <h1 className="mb-6 text-4xl leading-none font-black tracking-tighter text-slate-950 uppercase italic md:text-5xl">
              QUASE LÁ. <br />{" "}
              <span className="text-indigo-600">VERIFIQUE SEU E-MAIL.</span>
            </h1>
            <p className="text-lg leading-relaxed font-medium text-slate-500">
              Enviamos um código de 6 dígitos para o seu e-mail corporativo.{" "}
              <br />
              Insira-o abaixo para ativar sua loja.
            </p>
          </div>

          <div className="mb-12 flex justify-center gap-2 md:gap-4">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-16 w-12 rounded-2xl border border-slate-100 bg-slate-50 text-center text-3xl font-black text-indigo-600 shadow-sm transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none md:h-20 md:w-16"
              />
            ))}
          </div>

          <button className="group relative w-full overflow-hidden rounded-3xl bg-indigo-600 py-6 text-xl font-black text-white shadow-xl transition-all hover:bg-indigo-700 hover:shadow-[0_20px_40px_rgba(79,70,229,0.2)] active:scale-95">
            <span className="relative z-10 flex items-center justify-center gap-2">
              CONFIRMAR CÓDIGO{" "}
              <ArrowRight
                size={24}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
            <div className="absolute inset-0 translate-y-full bg-slate-950 transition-transform duration-300 group-hover:translate-y-0" />
          </button>

          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isResending ? "animate-spin" : ""}
              />
              {isResending ? "Reenviando..." : "Não recebeu? Reenviar código"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
