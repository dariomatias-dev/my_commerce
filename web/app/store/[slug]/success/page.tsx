"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { ArrowRight, CheckCircle2, Package, ShoppingBag } from "lucide-react";

import { ActionButton } from "@/components/buttons/action-button";

export default function OrderSuccessPage() {
  const router = useRouter();

  const params = useParams();

  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const slug = params.slug as string;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-[3rem] border-2 border-slate-100 bg-white p-8 text-center shadow-2xl shadow-slate-200/50 md:p-16">
          <div className="absolute top-0 left-1/2 h-2 w-full -translate-x-1/2 bg-linear-to-r from-transparent via-emerald-500 to-transparent" />

          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-75" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <span className="mb-4 inline-block text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase">
            Pedido Realizado com Sucesso
          </span>

          <h1 className="mb-6 text-4xl font-black tracking-tighter text-slate-950 uppercase italic md:text-5xl">
            Obrigado pela <span className="text-indigo-600">Confiança!</span>
          </h1>

          <p className="mx-auto mb-12 max-w-sm text-sm leading-relaxed font-bold text-slate-500">
            Seu pedido foi recebido e já está em processamento. Enviamos os detalhes da confirmação
            para o seu e-mail.
          </p>

          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-3xl border-2 border-slate-50 bg-slate-50/50 p-6 text-left transition-colors hover:border-indigo-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                <Package size={24} />
              </div>

              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Status
                </p>

                <p className="text-sm font-black text-slate-950">Preparando Pedido</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border-2 border-slate-50 bg-slate-50/50 p-6 text-left transition-colors hover:border-indigo-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                <ShoppingBag size={24} />
              </div>

              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Entrega
                </p>

                <p className="text-sm font-black text-slate-950">Envio Imediato</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ActionButton onClick={() => router.push(`/store/${slug}`)} variant="dark" showArrow>
              Continuar Comprando
            </ActionButton>

            <button
              onClick={() => router.push("/orders")}
              className="flex items-center justify-center gap-2 py-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-indigo-600"
            >
              Acompanhar meus pedidos
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase opacity-50">
          ID do Pedido: #{orderId}
        </p>
      </div>
    </main>
  );
}
