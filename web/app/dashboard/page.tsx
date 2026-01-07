"use client";

import {
  Activity,
  ArrowUpRight,
  Package,
  Plus,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  const stats = [
    { label: "Total em Lojas", value: "04", icon: Store, trend: "+1 este mês" },
    { label: "Produtos Ativos", value: "128", icon: Package, trend: "+12%" },
    { label: "Clientes Totais", value: "1.2k", icon: Users, trend: "+5.4%" },
    {
      label: "Taxa de Conversão",
      value: "3.2%",
      icon: Activity,
      trend: "+0.8%",
    },
  ];

  const stores = [
    {
      id: "1",
      name: "Neo Tech Store",
      slug: "neo-tech",
      status: "ACTIVE",
      products: 42,
      revenue: "R$ 12.400",
    },
    {
      id: "2",
      name: "Minimalist Home",
      slug: "minimalist-home",
      status: "ACTIVE",
      products: 18,
      revenue: "R$ 5.200",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <div className="mx-auto max-w-400 px-6 pt-40 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
                Painel de Controle
              </span>
              <h1 className="mt-2 text-5xl font-black uppercase italic tracking-tighter text-slate-950 lg:text-6xl">
                Olá, <span className="text-indigo-600">Subscriber</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-tight">
                Gerencie suas lojas e monitore o desempenho global.
              </p>
            </div>

            <Link
              href="/dashboard/stores/new"
              className="flex items-center gap-3 rounded-2xl bg-slate-950 px-8 py-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 active:scale-95"
            >
              <Plus size={18} />
              Nova Loja
            </Link>
          </header>

          <section className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-950">
                    <stat.icon size={24} />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                    <TrendingUp size={12} /> {stat.trend}
                  </span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-black tracking-tighter text-slate-950">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-indigo-600" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
                  Minhas <span className="text-indigo-600">Lojas</span>
                </h2>
              </div>
              <Link
                href="/dashboard/stores"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
              >
                Ver todas as lojas
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="group relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          Loja Online
                        </span>
                      </div>
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950">
                        {store.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400">
                        /{store.slug}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/stores/${store.slug}`}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white transition-all group-hover:bg-indigo-600"
                    >
                      <ArrowUpRight size={24} />
                    </Link>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-50 pt-10">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Produtos
                      </p>
                      <p className="text-xl font-black text-slate-950">
                        {store.products}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Faturamento
                      </p>
                      <p className="text-xl font-black text-slate-950">
                        {store.revenue}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Link
                      href={`/dashboard/stores/${store.slug}/products`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <Package size={14} /> Gerenciar Itens
                    </Link>
                    <Link
                      href={`/dashboard/stores/${store.slug}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      Configurações
                    </Link>
                  </div>
                </div>
              ))}

              <Link
                href="/dashboard/stores/new"
                className="flex min-h-75 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm transition-transform hover:scale-110">
                  <Plus size={32} />
                </div>
                <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Registrar nova loja
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
