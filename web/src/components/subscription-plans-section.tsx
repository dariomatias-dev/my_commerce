import { Check } from "lucide-react";

export const SubscriptionPlansSection = () => {
  return (
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
  );
};
