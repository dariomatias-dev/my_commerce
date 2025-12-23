"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Box,
  CheckCircle,
  ChevronRight,
  Clock,
  Cpu,
  Download,
  ExternalLink,
  Plus,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";

const StoreDashboardPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const onAction = () => {
      const name = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setStoreName(name);
    };

    onAction();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <DashboardHeader />

      <main className="mx-auto max-w-400 px-6 pt-32 pb-12">
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
            <div>
              <Link
                href="/dashboard"
                className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
              >
                <ArrowLeft size={14} /> Voltar para instâncias
              </Link>

              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-5 items-center rounded bg-indigo-600 px-2 text-[9px] font-black tracking-widest text-white uppercase">
                  MODO DASHBOARD: {slug.toUpperCase()}
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
                  ID: {slug}-SECURED
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
                CONSOLE DE <span className="text-indigo-600">{storeName}.</span>
              </h1>
            </div>

            <div className="flex w-full flex-wrap gap-3 lg:w-auto">
              <button className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 lg:flex-none">
                <Download size={14} /> EXPORTAR RELATÓRIO
              </button>
              <button className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95 lg:flex-none">
                <Plus size={16} /> ADICIONAR PRODUTO
              </button>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                rotulo: "Fluxo de Vendas",
                valor: "R$ 142.380,44",
                sub: "Volume acumulado 24h",
                icon: Activity,
              },
              {
                rotulo: "Disponibilidade",
                valor: "99.99%",
                sub: "SLA de serviço estável",
                icon: ShieldCheck,
              },
              {
                rotulo: "Taxa de Requisições",
                valor: "1.240 req/s",
                sub: "Pico de processamento",
                icon: Cpu,
              },
              {
                rotulo: "Conversão Global",
                valor: "4.12%",
                sub: "+0.8% em relação a ontem",
                icon: BarChart3,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-lg bg-slate-50 p-2 text-indigo-600">
                    <stat.icon size={18} />
                  </div>
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {stat.rotulo}
                </p>
                <h3 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 italic">
                  {stat.valor}
                </h3>
                <p className="mt-2 text-[9px] font-bold tracking-tight text-slate-400 uppercase">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:col-span-8">
              <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-emerald-500" />
                  <h2 className="text-xs font-black tracking-widest text-slate-950 uppercase italic">
                    TRANSAÇÕES BEM SUCEDIDAS
                  </h2>
                </div>
                <button className="rounded-lg bg-slate-50 p-2 text-slate-400 transition-colors hover:text-indigo-600">
                  <RefreshCcw size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                      <th className="py-4 pl-8">ID DA TRANSAÇÃO</th>
                      <th className="py-4">CLIENTE</th>
                      <th className="py-4">STATUS</th>
                      <th className="py-4 pr-8 text-right">VALOR LÍQUIDO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                      <tr
                        key={row}
                        className="group transition-colors hover:bg-slate-50/80"
                      >
                        <td className="py-5 pl-8 text-sm font-black text-slate-950 italic">
                          #TXN-{9420 + row}B-SUCCESS
                        </td>
                        <td className="py-5 text-xs font-bold text-slate-600">
                          Lead Client {row}
                        </td>
                        <td className="py-5">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-emerald-600 uppercase">
                            Aprovado
                          </span>
                        </td>
                        <td className="py-5 pr-8 text-right text-sm font-black text-slate-950">
                          <RandomPrice />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl shadow-slate-200">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tighter text-indigo-400 uppercase italic">
                    Estoques Baixos
                  </h3>
                  <AlertTriangle className="text-orange-500" size={20} />
                </div>
                <div className="space-y-6">
                  {[
                    {
                      label: "Sneaker Urban X",
                      sku: "SKU-9920",
                      stock: 3,
                      alert: 85,
                    },
                    {
                      label: "Relógio Minimalist",
                      sku: "SKU-1042",
                      stock: 1,
                      alert: 95,
                    },
                  ].map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-black tracking-tight text-white uppercase italic">
                            {item.label}
                          </p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">
                            {item.sku}
                          </p>
                        </div>
                        <p className="text-[11px] font-black text-orange-500 italic">
                          {item.stock} un.
                        </p>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            item.stock <= 2 ? "bg-red-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${item.alert}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-indigo-500 hover:text-white">
                  REABASTECER AGORA <ArrowRight size={14} />
                </button>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-widest text-slate-950 uppercase italic">
                    Ações Rápidas
                  </h3>
                  <Clock size={16} className="text-slate-300" />
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Análise de Faturamento", icon: BarChart3 },
                    { label: "Gestão de Inventário", icon: Box },
                    { label: "Configurações Globais", icon: ExternalLink },
                  ].map((action, i) => (
                    <button
                      key={i}
                      className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-600 hover:bg-indigo-50"
                    >
                      <div className="flex items-center gap-3">
                        <action.icon
                          size={16}
                          className="text-slate-400 group-hover:text-indigo-600"
                        />
                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase group-hover:text-indigo-600">
                          {action.label}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-slate-300 group-hover:text-indigo-600"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const RandomPrice = () => {
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    const onAction = () => {
      const value = (Math.random() * 800 + 100).toFixed(2);
      setPrice(value);
    };

    onAction();
  }, []);

  if (!price) return null;

  return <span>R$ {price}</span>;
};

export default StoreDashboardPage;
