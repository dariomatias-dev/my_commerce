"use client";

import { CheckCircle2, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export const SubscriptionPlansSection = () => {
  return (
    <section
      className="relative overflow-hidden bg-white py-32 lg:py-48"
      id="planos"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-100 w-100 rounded-full bg-slate-50/50 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-24 flex flex-col items-start justify-between gap-8 border-b border-slate-100 pb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-indigo-600">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                Escalabilidade Ilimitada
              </span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic md:text-8xl">
              ESCOLHA SEU <br />
              <span className="text-indigo-600">COMBUSTÍVEL.</span>
            </h2>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Modelo de Negócio
            </p>
            <p className="text-xl font-bold text-slate-950 uppercase italic">
              0% Taxa de Faturamento
            </p>
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-3">
          {/* Plan: Basic */}
          <div className="group relative flex flex-col rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5">
            <div className="mb-10">
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                Start
              </span>
              <h3 className="mt-2 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
                Basic
              </h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-slate-950 italic">
                  R$ 0
                </span>
                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                  /mês
                </span>
              </div>
            </div>

            <div className="mb-10 grow space-y-5">
              {[
                "1 Loja Operacional",
                "Até 10 SKUs ativos",
                "Checkout MyEcommerce",
                "Suporte via Ticket",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-slate-500 italic"
                >
                  <CheckCircle2
                    size={18}
                    className="text-slate-300 transition-colors group-hover:text-indigo-600"
                  />
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="flex w-full items-center justify-center rounded-2xl border-2 border-slate-950 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-slate-950 hover:text-white active:scale-95"
            >
              Começar de Graça
            </Link>
          </div>

          {/* Plan: PRO (Featured) */}
          <div className="relative flex flex-col rounded-[3.5rem] bg-slate-950 p-12 text-white shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)] ring-4 ring-indigo-600/10 lg:-mt-8 lg:-mb-8">
            <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-indigo-600 px-6 py-2 shadow-xl shadow-indigo-600/20">
              <Sparkles size={12} fill="white" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">
                O Mais Vendido
              </span>
            </div>

            <div className="mb-10 text-center">
              <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase">
                Growth
              </span>
              <h3 className="mt-2 text-4xl font-black tracking-tighter uppercase italic">
                Professional
              </h3>
              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-7xl font-black tracking-tighter italic">
                  R$ 49
                </span>
                <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">
                  /mês
                </span>
              </div>
            </div>

            <div className="mb-10 grow space-y-5">
              {[
                "Lojas Ilimitadas",
                "Produtos Ilimitados",
                "Domínio Customizado",
                "Recuperação de Carrinho",
                "Suporte prioritário 24/7",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold italic"
                >
                  <CheckCircle2 size={18} className="text-indigo-500" />
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 py-5 text-xs font-black tracking-widest text-white transition-all hover:bg-indigo-500 active:scale-95"
            >
              <span className="relative z-10">ASSINAR AGORA</span>
              <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
          </div>

          {/* Plan: Business */}
          <div className="group relative flex flex-col rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5">
            <div className="mb-10">
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                Enterprise
              </span>
              <h3 className="mt-2 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
                Business
              </h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-slate-950 italic">
                  R$ 99
                </span>
                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                  /mês
                </span>
              </div>
            </div>

            <div className="mb-10 grow space-y-5">
              {[
                "Webhooks & API de Acesso",
                "Multi-usuários (Staff)",
                "Faturamento Integrado",
                "Gerente de Conta Dedicado",
                "Customização via CSS",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-slate-500 italic"
                >
                  <CheckCircle2
                    size={18}
                    className="text-slate-300 transition-colors group-hover:text-indigo-600"
                  />
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="flex w-full items-center justify-center rounded-2xl border-2 border-slate-950 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-slate-950 hover:text-white active:scale-95"
            >
              Falar com Consultor
            </Link>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase italic">
            Upgrade ou Downgrade a qualquer momento • Cancelamento sem multas
          </p>
        </div>
      </div>
    </section>
  );
};
