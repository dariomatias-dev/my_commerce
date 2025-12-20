"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Search,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
  ZapIcon,
} from "lucide-react";
import { useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Como funciona a migração de outra plataforma?",
      a: "Nossa equipe cuida de tudo. Importamos seus produtos, clientes e histórico de pedidos em menos de 24h sem tirar sua loja do ar.",
    },
    {
      q: "Quais as formas de pagamento aceitas?",
      a: "Integração nativa com Pix, principais cartões de crédito e boleto. Taxas exclusivas já negociadas para nossos parceiros.",
    },
    {
      q: "Posso vender em marketplaces como Amazon e Magalu?",
      a: "Sim! O MyEcommerce centraliza seu estoque e pedidos de múltiplos canais em um único painel inteligente.",
    },
    {
      q: "Existe limite de visitas ou tráfego?",
      a: "Nenhum. Nossa infraestrutura escala automaticamente para aguentar desde o primeiro acesso até o Black Friday.",
    },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Header />

      <section className="relative flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-6 py-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-[10px] font-black tracking-[0.3em] text-indigo-700 uppercase">
              Seu império começa hoje
            </span>
          </div>

          <h1 className="mb-12 text-7xl leading-[0.85] font-black tracking-tighter text-slate-950 md:text-9xl lg:text-[180px] xl:text-[220px]">
            CONSTRUA. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-clip-text text-transparent italic">
              VENDA.
            </span>
          </h1>

          <p className="mx-auto mb-16 max-w-3xl text-xl leading-relaxed font-medium tracking-tight text-slate-500 md:text-3xl">
            A infraestrutura definitiva para e-commerce.
            <br className="hidden md:block" />
            Venda em minutos, escale para milhões.
          </p>

          <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
            <button className="group flex items-center justify-center gap-4 rounded-full bg-indigo-600 px-14 py-8 text-2xl font-black text-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.4)] transition-all hover:bg-indigo-700 active:scale-95">
              Começar Agora <ArrowRight size={28} />
            </button>

            <div className="flex items-center -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 w-12 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm"
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=${i + 10}`}
                    alt="User"
                  />
                </div>
              ))}
              <span className="pl-6 text-sm font-bold tracking-widest text-slate-400 uppercase">
                +15k Lojistas
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-12 text-center text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase">
            Confiado pelas marcas que mais crescem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:gap-24">
            {["Amazon", "Stripe", "Loggi", "Meta", "Google"].map((logo) => (
              <span
                key={logo}
                className="text-3xl font-black tracking-tighter text-slate-900 italic"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden py-40" id="funcionalidades">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative mb-40 flex flex-col items-center gap-16 lg:flex-row">
            <div className="relative z-10 lg:w-1/2">
              <div className="mb-6 inline-flex items-center gap-2">
                <div className="h-px w-8 bg-indigo-600"></div>
                <span className="text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase">
                  Infraestrutura Operacional
                </span>
              </div>
              <h2 className="mb-10 text-6xl leading-[0.9] font-black tracking-tighter text-slate-900 md:text-8xl">
                Controle <br />
                <span className="cursor-default text-slate-300 italic transition-colors hover:text-indigo-600">
                  Absoluto.
                </span>
              </h2>
              <div className="grid gap-10">
                {[
                  {
                    t: "Pagamentos Integrados",
                    d: "Checkout transparente com Pix e Cartão nativos. Sem redirecionamentos, sem fricção.",
                    i: <Zap className="h-6 w-6" />,
                  },
                  {
                    t: "Logística Inteligente",
                    d: "Cálculo de frete em tempo real com as melhores transportadoras do país.",
                    i: <Globe className="h-6 w-6" />,
                  },
                ].map((item, i) => (
                  <div key={i} className="group flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      {item.i}
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tight">
                        {item.t}
                      </h4>
                      <p className="mt-2 leading-relaxed font-medium text-slate-500">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:w-1/2">
              <div className="absolute -inset-10 -z-10 rounded-full bg-indigo-50 blur-[100px]" />
              <div className="relative">
                <div className="absolute top-1/4 -left-12 z-20 hidden animate-bounce rounded-3xl border border-white bg-white/80 p-6 shadow-2xl backdrop-blur-xl duration-[4000ms] lg:block">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-emerald-500 p-2 text-white">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Conversão
                      </p>
                      <p className="text-xl font-black text-slate-900">
                        +24.8%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[3rem] bg-slate-200 shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
                  <img
                    src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    alt="Gestão de Loja"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center gap-16 lg:flex-row">
            <div className="relative lg:w-1/2">
              <div className="absolute -inset-10 -z-10 rounded-full bg-violet-50 blur-[100px]" />
              <div className="relative overflow-hidden rounded-[3rem] border-[12px] border-slate-50 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
                  className="w-full object-cover"
                  alt="Marketing"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="mb-6 inline-flex items-center gap-2">
                <div className="h-px w-8 bg-violet-600"></div>
                <span className="text-[10px] font-black tracking-[0.4em] text-violet-600 uppercase">
                  Visibilidade & SEO
                </span>
              </div>
              <h2 className="mb-10 text-6xl leading-[0.9] font-black tracking-tighter text-slate-900 md:text-8xl">
                Venda no <br />
                <span className="text-violet-600">Topo.</span>
              </h2>
              <p className="mb-10 text-2xl leading-relaxed font-medium tracking-tight text-slate-500">
                Sua loja nasce otimizada. Não apenas para pessoas, mas para os
                algoritmos. Apareça onde seus clientes buscam.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Google Shopping", "Instagram Ads", "TikTok XML"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-100 bg-white px-6 py-3 text-xs font-black tracking-widest text-slate-400 uppercase"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-10 text-5xl font-black tracking-tighter italic md:text-7xl">
            Onde seus clientes estão.
          </h2>
          <p className="mx-auto mb-20 max-w-2xl text-xl leading-relaxed font-medium text-slate-500">
            Sincronize sua loja com os maiores marketplaces e redes sociais do
            mundo. Venda no Instagram, Google e TikTok em um clique.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { t: "Google Shopping", i: <Search className="text-blue-500" /> },
              {
                t: "Instagram Sync",
                i: <Smartphone className="text-pink-500" />,
              },
              { t: "Amazon API", i: <Globe className="text-orange-500" /> },
              {
                t: "WhatsApp Sales",
                i: <ZapIcon className="text-emerald-500" />,
              },
            ].map((int) => (
              <div
                key={int.t}
                className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white px-8 py-6 shadow-sm transition-all hover:shadow-xl"
              >
                {int.i}
                <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">
                  {int.t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/50 py-40" id="planos">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-32 flex flex-col items-end justify-between gap-10 md:flex-row">
            <div className="max-w-2xl">
              <h2 className="text-6xl font-black tracking-tighter text-slate-950 md:text-8xl">
                Escolha seu <br />{" "}
                <span className="text-indigo-600">Combustível.</span>
              </h2>
            </div>
            <p className="max-w-xs text-right font-bold tracking-widest text-slate-400 uppercase italic">
              Preços honestos. <br /> Sem taxas sobre faturamento.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col rounded-[3.5rem] bg-white p-12 shadow-sm transition-all hover:shadow-2xl">
              <div className="mb-12">
                <h3 className="text-sm font-black tracking-[0.3em] text-slate-400 uppercase">
                  Basic
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter text-slate-900">
                    R$ 0
                  </span>
                  <span className="text-lg font-bold text-slate-300">/mês</span>
                </div>
              </div>
              <div className="mb-12 flex-grow space-y-6">
                {["1 Loja Ativa", "Até 10 Produtos", "Checkout Padrão"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 font-bold text-slate-500"
                    >
                      <Check size={18} className="text-indigo-600" /> {item}
                    </div>
                  ),
                )}
              </div>
              <button className="w-full rounded-2xl border-2 border-slate-950 py-5 text-xs font-black tracking-widest uppercase transition-all hover:bg-slate-950 hover:text-white">
                Começar Agora
              </button>
            </div>

            <div className="relative z-10 scale-105 rounded-[3.5rem] bg-slate-950 p-12 text-white shadow-2xl">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-6 py-2 text-[10px] font-black tracking-[0.4em] text-white uppercase">
                Recomendado
              </div>
              <div className="mb-12">
                <h3 className="text-sm font-black tracking-[0.3em] text-indigo-400 uppercase">
                  Pro
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter">
                    R$ 49
                  </span>
                  <span className="text-lg font-bold text-slate-500">/mês</span>
                </div>
              </div>
              <div className="mb-12 flex-grow space-y-6">
                {[
                  "Lojas Ilimitadas",
                  "Produtos Ilimitados",
                  "Domínio Próprio",
                  "Suporte 24h",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 font-bold">
                    <Check size={18} className="text-indigo-500" /> {item}
                  </div>
                ))}
              </div>
              <button className="w-full rounded-2xl bg-indigo-600 py-5 text-xs font-black tracking-widest uppercase transition-all hover:bg-indigo-700">
                Assinar Pro
              </button>
            </div>

            <div className="flex flex-col rounded-[3.5rem] bg-white p-12 shadow-sm transition-all hover:shadow-2xl">
              <div className="mb-12 text-right">
                <h3 className="text-sm font-black tracking-[0.3em] text-slate-400 uppercase">
                  Business
                </h3>
                <div className="mt-4 flex items-baseline justify-end gap-1">
                  <span className="text-6xl font-black tracking-tighter text-slate-900">
                    R$ 99
                  </span>
                  <span className="text-lg font-bold text-slate-300">/mês</span>
                </div>
              </div>
              <div className="mb-12 flex-grow space-y-6 text-right">
                {[
                  "API de Integração",
                  "Faturamento via ERP",
                  "Gerente Dedicado",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex flex-row-reverse items-center gap-3 font-bold text-slate-500"
                  >
                    <Check size={18} className="text-indigo-600" /> {item}
                  </div>
                ))}
              </div>
              <button className="w-full rounded-2xl border-2 border-slate-950 py-5 text-xs font-black tracking-widest uppercase transition-all hover:bg-slate-950 hover:text-white">
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40" id="faq">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-24 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tighter uppercase italic">
              Perguntas Frequentes
            </h2>
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Tudo o que você precisa saber
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-10 py-8 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="text-lg font-black tracking-tight">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${openFaq === i ? "rotate-180 text-indigo-600" : "text-slate-300"}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="animate-in slide-in-from-top-2 px-10 pb-10 text-lg leading-relaxed font-medium text-slate-500 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-indigo-600 py-40 lg:py-60">
        <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="absolute -top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-white/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-16 text-6xl leading-none font-black tracking-tighter text-white italic md:text-9xl xl:text-[12rem]">
            SEU SUCESSO <br /> NÃO ESPERA.
          </h2>
          <p className="mx-auto mb-20 max-w-4xl text-2xl font-medium tracking-tight text-indigo-100 md:text-4xl">
            Pare de apenas olhar. Comece a vender hoje na plataforma de
            e-commerce que mais cresce no Brasil.
          </p>
          <button className="group shadow-3xl relative overflow-hidden rounded-full bg-white px-20 py-10 text-4xl font-black text-indigo-600 transition-all hover:scale-105 active:scale-95">
            <span className="relative z-10 uppercase">Criar Loja Agora</span>
            <div className="absolute inset-0 translate-y-[100%] bg-slate-950 transition-transform duration-300 group-hover:translate-y-0" />
            <span className="absolute inset-0 z-20 flex translate-y-[100%] items-center justify-center font-black text-white uppercase transition-transform duration-300 group-hover:translate-y-0">
              Comece grátis
            </span>
          </button>
          <div className="mt-16 text-sm font-black tracking-[0.5em] text-indigo-200 uppercase italic opacity-60">
            Não é necessário cartão de crédito • Comece em 2 minutos
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
