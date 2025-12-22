import {
  Globe,
  Search,
  Smartphone,
  TrendingUp,
  Zap,
  ZapIcon
} from "lucide-react";

import { CtaSection } from "@/components/cta-section";
import { FaqsSection } from "@/components/faqs-section";
import { HeroSection } from "@/components/hero-section.";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SubscriptionPlansSection } from "@/components/subscription-plans-section";

const Home = () => {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Header />

      <HeroSection />

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

      <SubscriptionPlansSection />

      <FaqsSection />

      <CtaSection />

      <Footer />
    </main>
  );
};

export default Home;
