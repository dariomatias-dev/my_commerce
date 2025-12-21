"use client";

import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Loader2, Store, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const EmailVerificationCard = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Token de verificação não encontrado.");
        return;
      }

      try {
        await verifyEmail({ token });
        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message || "Link expirado ou inválido.");
      }
    };

    handleVerify();
  }, [token, verifyEmail]);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] md:p-14">
      <div className="mb-6 flex justify-center">
        <div className="rounded-xl bg-slate-950 p-2 shadow-lg shadow-slate-200">
          <Store className="h-5 w-5 text-white" />
        </div>
      </div>

      {status === "loading" && (
        <div className="animate-in fade-in duration-500">
          <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic md:text-4xl">
            VALIDANDO <span className="text-indigo-600">ACESSO...</span>
          </h1>
          <p className="mb-8 text-sm font-medium text-slate-500">
            Aguarde um momento enquanto confirmamos suas credenciais.
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="animate-in zoom-in-95 duration-500">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-50 p-4">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic md:text-4xl">
            CONTA <span className="text-emerald-500">ATIVA.</span>
          </h1>
          <p className="mb-10 text-sm font-medium text-slate-500">
            Sua conta foi verificada com sucesso. <br />
            Você já pode acessar seu painel administrativo.
          </p>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 py-4 text-xs font-black tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95"
          >
            FAZER LOGIN AGORA
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-50 p-4">
              <XCircle size={48} className="text-red-500" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tighter text-slate-950 uppercase italic md:text-4xl">
            ERRO NA <span className="text-red-500">VERIFICAÇÃO.</span>
          </h1>
          <p className="mb-10 text-sm font-medium text-slate-500">
            {errorMessage}
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 py-4 text-xs font-black tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95"
            >
              CRIAR NOVA CONTA
            </Link>
            <Link
              href="/login"
              className="text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
