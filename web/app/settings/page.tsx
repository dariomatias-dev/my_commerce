"use client";

import {
  Bell,
  ChevronRight,
  Code2,
  CreditCard,
  Database,
  Globe,
  Lock,
  Save,
  ShieldCheck,
  Store,
  Terminal,
} from "lucide-react";
import { useState } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("loja");

  const tabs = [
    { id: "loja", label: "Geral da Loja", icon: Store },
    { id: "dominio", label: "Domínios & DNS", icon: Globe },
    { id: "seguranca", label: "Segurança", icon: Lock },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "api", label: "API & Webhooks", icon: Code2 },
    { id: "assinatura", label: "Faturamento", icon: CreditCard },
  ];

  return (
    <>
      <DashboardHeader />

      <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
              MODO_CONFIG
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
              Ajustes de Infraestrutura e Preferências
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
            CONFIGURAÇÕES DO <span className="text-indigo-600">SISTEMA.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-5 py-4 transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-950 border border-slate-950 text-white shadow-xl shadow-slate-200"
                      : "bg-white text-slate-500 border border-slate-100 hover:border-indigo-600/30 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon
                      size={18}
                      className={activeTab === tab.id ? "text-indigo-400" : ""}
                    />
                    <span className="text-[11px] font-black tracking-widest uppercase">
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={
                      activeTab === tab.id ? "opacity-100" : "opacity-0"
                    }
                  />
                </button>
              ))}
            </nav>

            <div className="mt-10 rounded-2xl bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Protocolo de Segurança
                </p>
              </div>
              <p className="text-xs font-medium leading-relaxed italic">
                Suas configurações são replicadas em clusters redundantes para
                garantir 100% de disponibilidade.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm transition-all animate-in fade-in slide-in-from-right-4">
              {activeTab === "loja" && (
                <div className="space-y-10">
                  <div className="border-b border-slate-50 pb-6">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
                      Ajustes Gerais
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Identidade e Localização da Instância
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Nome da Exibição
                      </label>
                      <input
                        type="text"
                        placeholder="Alpha Urban Store"
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3.5 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Fuso Horário Global
                      </label>
                      <select className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3.5 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none">
                        <option>(GMT-03:00) São Paulo / Brasil</option>
                        <option>(GMT+00:00) London / UK</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        E-mail de Atendimento
                      </label>
                      <input
                        type="email"
                        placeholder="vendas@loja.com"
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3.5 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Modo de Operação
                      </label>
                      <div className="flex items-center gap-4 py-2">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            defaultChecked
                          />
                          <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full" />
                        </label>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                          Loja Ativa para Vendas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div className="space-y-10">
                  <div className="border-b border-slate-50 pb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
                        Acesso Desenvolvedor
                      </h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Chaves e Integrações de Backend
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-indigo-600">
                      <Terminal size={20} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Private API Key (Production)
                        </p>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[8px] font-black text-emerald-600 uppercase">
                          Live
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="password"
                          readOnly
                          value="mk_live_77x88y99z00alpha"
                          className="flex-1 bg-transparent font-mono text-sm font-bold text-slate-950 outline-none"
                        />
                        <button className="text-[10px] font-black tracking-widest text-indigo-600 uppercase hover:text-indigo-700">
                          Copiar
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Webhook Endpoint
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-black text-slate-400 uppercase">
                            Aguardando Eventos
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="https://seu-erp.com/webhooks/myecommerce"
                        className="w-full bg-transparent font-mono text-sm font-bold text-slate-950 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notificacoes" && (
                <div className="space-y-10">
                  <div className="border-b border-slate-50 pb-6">
                    <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
                      Canais de Alerta
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Gerencie como você recebe atualizações
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Novas Vendas",
                        desc: "Notificar via E-mail e Push quando um pedido for pago.",
                        status: true,
                      },
                      {
                        title: "Estoque Baixo",
                        desc: "Avisar quando um produto atingir o limite crítico.",
                        status: true,
                      },
                      {
                        title: "Relatórios Diários",
                        desc: "Enviar resumo de faturamento às 08:00 AM.",
                        status: false,
                      },
                      {
                        title: "Updates de Segurança",
                        desc: "Alertas críticos sobre acessos e patches.",
                        status: true,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-2xl border border-slate-50 p-6 transition-all hover:bg-slate-50/50"
                      >
                        <div className="max-w-md">
                          <h4 className="text-sm font-black text-slate-950 uppercase italic tracking-tight">
                            {item.title}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-500 mt-1">
                            {item.desc}
                          </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            defaultChecked={item.status}
                          />
                          <div className="h-5 w-9 rounded-full bg-slate-200 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
                  <Database size={14} className="text-indigo-400" />
                  Sincronização em Tempo Real Ativa
                </div>
                <button className="flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95">
                  <Save size={18} />
                  SALVAR CONFIGURAÇÕES
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SettingsPage;
