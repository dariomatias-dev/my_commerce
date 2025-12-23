"use client";

import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[70%] w-[60%] animate-pulse rounded-full bg-indigo-50/40 blur-[120px]" />
        <div className="absolute right-[-5%] bottom-[-5%] h-[60%] w-[50%] rounded-full bg-violet-50/30 blur-[100px]" />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />

        <div className="absolute top-0 left-1/4 h-full w-px bg-linear-to-b from-transparent via-slate-100 to-transparent" />
        <div className="absolute top-0 right-1/4 h-full w-px bg-linear-to-b from-transparent via-slate-100 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/50 px-4 py-1.5 shadow-sm backdrop-blur-md transition-all hover:border-indigo-200 hover:bg-white">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-600 uppercase">
            Plataforma SaaS Enterprise
          </span>
        </div>

        <h1 className="mb-6 text-5xl leading-[1.1] font-black tracking-[-0.04em] text-slate-950 sm:text-7xl lg:text-8xl">
          CONSTRUA. <br />
          <span className="relative inline-block bg-linear-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-clip-text text-transparent italic">
            VENDA AGORA.
            <svg
              className="absolute -bottom-2 left-0 w-full opacity-60"
              viewBox="0 0 400 20"
              fill="none"
            >
              <path
                d="M5 15C100 5 300 5 395 15"
                stroke="url(#paint0_linear)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="0"
                  y1="0"
                  x2="400"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-medium tracking-tight text-slate-500 md:text-xl">
          A infraestrutura definitiva para o seu e-commerce.{" "}
          <br className="hidden md:block" />
          Abandone a burocracia técnica e foque em{" "}
          <span className="font-bold text-slate-900 underline decoration-indigo-500/20 decoration-4 underline-offset-4">
            escalar seu lucro
          </span>
          .
        </p>

        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
            <button className="relative flex items-center justify-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:bg-indigo-600 active:scale-95">
              Criar Loja Grátis
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 lg:items-start">
            <div className="flex items-center -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm transition-transform hover:z-10 hover:scale-110"
                >
                  <Image
                    src={`https://i.pravatar.cc/100?u=${i + 40}`}
                    alt="Merchant"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-indigo-50 text-[10px] font-bold text-indigo-600 shadow-sm">
                +15k
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Lojistas faturando hoje
              </span>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-6 border-t border-slate-100 pt-10">
          {[
            { icon: <Zap size={16} />, label: "Checkout em 1s" },
            { icon: <ShieldCheck size={16} />, label: "Segurança Bancária" },
            { icon: <Globe size={16} />, label: "Escala Global" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex cursor-default items-center gap-2.5"
            >
              <div className="text-indigo-600 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <span className="text-[11px] font-black tracking-widest text-slate-900 uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Star = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);
