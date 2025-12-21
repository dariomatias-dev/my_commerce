"use client";

import { ApiError } from "@/@types/api";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Loader2, Store, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const EmailVerificationCard = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    const handleVerify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Token de verificação não encontrado na URL.");
        return;
      }

      try {
        await verifyEmail({ token });
        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Ocorreu um erro inesperado na verificação.");
        }
      }
    };

    handleVerify();
    effectRan.current = true;
  }, [token, verifyEmail]);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] md:p-14">
      <div className="mb-8 flex justify-center">
        <div className="rounded-xl bg-slate-950 p-2 shadow-lg shadow-slate-200">
          <Store className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mb-10 min-h-[160px]">
        {status === "loading" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
              VALIDANDO <span className="text-indigo-600">ACESSO...</span>
            </h1>
            <p className="mb-8 text-sm font-medium text-slate-500">
              Aguarde enquanto confirmamos sua identidade.
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-emerald-50 p-3">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
              CONTA <span className="text-emerald-500">ATIVA.</span>
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Sua conta foi verificada com sucesso.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-8 py-4 text-xs font-black tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95"
              >
                ACESSAR CONSOLE
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-50 p-3">
                <XCircle size={40} className="text-red-500" />
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
              FALHA NA <span className="text-red-500">ATIVAÇÃO.</span>
            </h1>
            <p className="text-sm font-medium text-slate-500">{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-slate-100 pt-8 text-center">
        <Link
          href="/login"
          className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-950"
        >
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
};
