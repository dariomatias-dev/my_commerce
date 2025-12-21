"use client";

import { RefreshCw, Store } from "lucide-react";
import React, { useRef, useState } from "react";

import { ActionButton } from "@/components/action-button";

export const VerifyEmailForm = () => {
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
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] md:p-14">
      <div className="mb-6 flex justify-center">
        <div className="rounded-xl bg-slate-950 p-2 shadow-lg shadow-slate-200">
          <Store className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic md:text-4xl">
          VERIFIQUE <span className="text-indigo-600">SEU ACESSO.</span>
        </h1>
        <p className="text-sm leading-relaxed font-medium text-slate-500">
          Insira o código de 6 dígitos enviado para o seu{" "}
          <br className="hidden md:block" />
          e-mail corporativo para ativar sua loja.
        </p>
      </div>

      <div className="mb-10 flex justify-center gap-2 md:gap-3">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-14 w-11 rounded-xl border border-slate-100 bg-slate-50 text-center text-2xl font-black text-indigo-600 shadow-sm transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none md:h-16 md:w-14"
          />
        ))}
      </div>

      <ActionButton label="CONFIRMAR CONTA" variant="dark" size="sm" />

      <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-50 pt-8">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600 disabled:opacity-50"
        >
          <RefreshCw size={12} className={isResending ? "animate-spin" : ""} />
          {isResending ? "Reenviando Código..." : "Não recebeu? Reenviar"}
        </button>
      </div>
    </div>
  );
};
