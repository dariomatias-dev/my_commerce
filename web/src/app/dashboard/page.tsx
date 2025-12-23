"use client";

import { ArrowRight, Plus, Store as StoreIcon, Zap } from "lucide-react";
import Link from "next/link";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";

const STORES = [
  {
    id: "1",
    slug: "alpha-urban-store",
    name: "Alpha Urban Store",
    domain: "alphastore.me",
    status: "OPERACIONAL",
    revenue: "R$ 42.120,00",
  },
  {
    id: "2",
    slug: "tech-gadgets-pro",
    name: "Tech Gadgets Pro",
    domain: "techpro.io",
    status: "OPERACIONAL",
    revenue: "R$ 12.850,00",
  },
  {
    id: "3",
    slug: "minimalist-design",
    name: "Minimalist Design",
    domain: "minimalist.com",
    status: "MANUTENÇÃO",
    revenue: "R$ 0,00",
  },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <DashboardHeader />

      <main className="mx-auto max-w-[1600px] px-6 pt-32 pb-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-12 border-b border-slate-200 pb-8">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase">
              <Zap size={12} fill="currentColor" />
              Unidades Gerenciadas
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
              MINHAS <span className="text-indigo-600">INSTÂNCIAS.</span>
            </h1>
            <p className="mt-2 text-sm font-bold text-slate-400 uppercase italic">
              Selecione uma loja para carregar o console de operações
              específico.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STORES.map((store) => (
              <Link
                key={store.id}
                href={`/dashboard/store/${store.slug}`}
                className="group relative flex flex-col items-start overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 text-left transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="mb-8 flex w-full items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 transition-transform group-hover:rotate-12 group-hover:bg-indigo-600 group-hover:text-white">
                    <StoreIcon size={28} />
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase ${
                      store.status === "OPERACIONAL"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${store.status === "OPERACIONAL" ? "animate-pulse bg-emerald-500" : "bg-orange-500"}`}
                    />
                    {store.status}
                  </div>
                </div>

                <h3 className="text-2xl leading-none font-black tracking-tighter text-slate-950 uppercase italic">
                  {store.name}
                </h3>
                <p className="mt-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {store.domain}
                </p>

                <div className="mt-12 flex w-full items-center justify-between border-t border-slate-50 pt-6">
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-slate-300 uppercase">
                      Receita Hoje
                    </p>
                    <p className="font-black text-slate-950 italic">
                      {store.revenue}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition-all group-hover:bg-indigo-600">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))}

            <button className="group flex min-h-[320px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 text-center transition-all hover:border-indigo-600 hover:bg-white">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-600">
                <Plus size={32} />
              </div>
              <span className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase group-hover:text-indigo-600">
                Inicializar Nova Loja
              </span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
