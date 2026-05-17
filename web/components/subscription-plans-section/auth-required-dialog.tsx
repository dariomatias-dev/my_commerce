"use client";

import { useRouter } from "next/navigation";

import { ArrowRight, KeyRound, X } from "lucide-react";

interface AuthRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthRequiredDialog = ({ isOpen, onClose }: AuthRequiredDialogProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    router.push("/login");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-md duration-500"
        onClick={onClose}
      />

      <div className="animate-in zoom-in-95 slide-in-from-bottom-10 relative w-full max-w-md overflow-hidden rounded-[3rem] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] duration-500">
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative h-32 bg-slate-950 px-10 pt-10">
          <div className="absolute -bottom-8 left-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-indigo-600 text-white shadow-xl ring-8 shadow-indigo-500/40 ring-white">
            <KeyRound size={32} strokeWidth={2.5} />
          </div>
        </div>

        <div className="px-10 pt-16 pb-10">
          <h2 className="text-3xl leading-none font-black tracking-tighter text-slate-950 uppercase italic">
            Quase lá! <br />
            <span className="text-xl text-indigo-600">Identifique-se primeiro.</span>
          </h2>

          <p className="mt-6 text-sm leading-relaxed font-bold text-slate-500 italic">
            Para garantir a segurança da sua assinatura e vincular o plano corretamente, você
            precisa acessar sua conta ou criar uma nova.
          </p>

          <div className="mt-10 space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-slate-950 p-1 text-white transition-all hover:bg-indigo-600 active:scale-[0.98]"
            >
              <span className="ml-6 text-[11px] font-black tracking-[0.2em] uppercase">
                Fazer Login Agora
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-transform group-hover:translate-x-1">
                <ArrowRight size={20} />
              </div>
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-2xl border-2 border-slate-100 bg-transparent py-4 text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase transition-all hover:bg-slate-50 hover:text-slate-600"
            >
              Voltar aos Planos
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
            <div className="h-px w-8 bg-slate-900" />
            <span className="text-[9px] font-black tracking-widest text-slate-900 uppercase">
              Safe & Secure
            </span>
            <div className="h-px w-8 bg-slate-900" />
          </div>
        </div>
      </div>
    </div>
  );
};
