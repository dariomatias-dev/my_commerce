"use client";

import { ArrowRight, CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { ActionButton } from "@/components/buttons/action-button";

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const slug = params.slug as string;

  return (
    <main className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="rounded-[3rem] border-2 border-slate-100 bg-white p-8 md:p-16 text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-linear-to-r from-transparent via-emerald-500 to-transparent" />

          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-75" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <span className="mb-4 inline-block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
            Pedido Realizado com Sucesso
          </span>

          <h1 className="mb-6 text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-950">
            Obrigado pela <span className="text-indigo-600">Confiança!</span>
          </h1>

          <p className="mx-auto mb-12 max-w-sm text-sm font-bold leading-relaxed text-slate-500">
            Seu pedido foi recebido e já está em processamento. Enviamos os
            detalhes da confirmação para o seu e-mail.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-4 rounded-3xl border-2 border-slate-50 bg-slate-50/50 p-6 text-left transition-colors hover:border-indigo-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                <Package size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </p>
                <p className="text-sm font-black text-slate-950">
                  Preparando Pedido
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border-2 border-slate-50 bg-slate-50/50 p-6 text-left transition-colors hover:border-indigo-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Entrega
                </p>
                <p className="text-sm font-black text-slate-950">
                  Envio Imediato
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ActionButton
              onClick={() => router.push(`/store/${slug}`)}
              variant="dark"
              showArrow
            >
              Continuar Comprando
            </ActionButton>

            <button
              onClick={() => router.push("/orders")}
              className="flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Acompanhar meus pedidos
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-50">
          ID do Pedido: #{orderId}
        </p>
      </div>
    </main>
  );
}
