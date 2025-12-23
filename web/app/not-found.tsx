"use client";

import { Home, Search, Sparkles } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="mt-12 flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden bg-white px-6 py-20 font-sans text-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] h-125 w-125 rounded-full bg-indigo-50/50 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-100 w-100 rounded-full bg-slate-50/50 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
              Erro de Protocolo 404
            </span>
          </div>

          <h1 className="mb-6 text-[10rem] leading-none font-black tracking-tighter text-slate-950 uppercase italic md:text-[15rem]">
            404<span className="text-indigo-600">.</span>
          </h1>

          <h2 className="mb-8 text-4xl font-black tracking-tighter text-slate-950 uppercase italic md:text-6xl">
            PÁGINA NÃO <br />
            <span className="text-indigo-600">LOCALIZADA.</span>
          </h2>

          <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed font-medium text-slate-500">
            O destino que você está tentando acessar não existe ou foi movido
            para uma nova coordenada em nossa infraestrutura.
          </p>

          <div className="flex justify-center">
            <Link
              href="/"
              className="flex gap-3 rounded-2xl bg-slate-950 px-8 py-4 text-xs font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95"
            >
              <Home size={16} />
              VOLTAR AO INÍCIO
            </Link>
          </div>

          <div className="mt-20 flex flex-col items-center justify-center gap-8 border-t border-slate-100 pt-12 md:flex-row">
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Search size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Diagnóstico
                </p>
                <p className="text-xs font-bold text-slate-900 italic">
                  Verifique a URL digitada
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Sugestão
                </p>
                <p className="text-xs font-bold text-slate-900 italic">
                  Volte para a página principal
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
