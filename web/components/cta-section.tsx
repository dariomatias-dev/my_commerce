"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const CtaSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-indigo-600 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

      <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-white/10 blur-[100px]" />

      <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-indigo-400/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles size={14} className="text-white" />

            <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase italic">
              Expansão Imediata
            </span>
          </div>

          <h2 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase italic md:text-7xl lg:text-8xl">
            SEU SUCESSO <br />
            <span className="text-slate-950 opacity-90">NÃO ESPERA.</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed font-medium tracking-tight text-indigo-50 md:text-xl">
            Abandone a indecisão. Junte-se a milhares de lojistas que escalaram
            seus negócios com a infraestrutura do{" "}
            <span className="font-black text-white italic underline decoration-slate-950 underline-offset-4">
              MyEcommerce
            </span>
            .
          </p>

          <Link href="/signup" className="group relative">
            <div className="absolute -inset-2 rounded-[3rem] bg-white/10 blur-xl transition-all group-hover:bg-white/20" />

            <button className="relative flex items-center gap-6 overflow-hidden rounded-[2.5rem] bg-white px-8 py-5 transition-all duration-500 md:px-12 md:py-6">
              <div className="flex flex-col items-start text-left leading-none">
                <span className="mb-1 text-[8px] font-black tracking-[0.3em] text-indigo-400 uppercase">
                  Setup em 2 minutos
                </span>

                <span className="text-xl font-black text-slate-950 uppercase italic md:text-2xl">
                  Criar minha loja
                </span>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white transition-transform duration-500 group-hover:-rotate-45 md:h-12 md:w-12">
                <ArrowRight size={20} strokeWidth={3} />
              </div>

              <div className="absolute inset-0 translate-y-full bg-slate-950 transition-transform duration-500 group-hover:translate-y-0" />

              <div className="absolute inset-0 z-20 flex translate-y-full items-center justify-between px-8 py-5 transition-transform duration-500 group-hover:translate-y-0 md:px-12 md:py-6">
                <div className="flex flex-col items-start text-left leading-none">
                  <span className="mb-1 text-[8px] font-black tracking-[0.3em] text-indigo-500 uppercase">
                    Grátis para sempre
                  </span>

                  <span className="text-xl font-black text-white uppercase italic md:text-2xl">
                    Começar Agora
                  </span>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 md:h-12 md:w-12">
                  <ArrowRight size={20} strokeWidth={3} />
                </div>
              </div>
            </button>
          </Link>

          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {["Sem taxas ocultas", "Sem cartão de crédito", "Suporte 24/7"].map(
              (text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-indigo-300" />

                  <span className="text-[10px] font-black tracking-widest text-indigo-200 uppercase italic">
                    {text}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
