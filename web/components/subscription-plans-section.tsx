"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";
import { useSubscriptionPlan } from "@/services/hooks/use-subscription-plan";

const FeaturedPlanCard = ({ plan }: { plan: SubscriptionPlanResponse }) => {
  const featuresList = plan.features?.split(",").map((f) => f.trim()) || [];

  return (
    <div className="relative flex flex-col rounded-[3.5rem] bg-slate-950 p-12 text-white shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)] ring-4 ring-indigo-600/10 lg:-mt-8 lg:-mb-8">
      <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-indigo-600 px-6 py-2 shadow-xl shadow-indigo-600/20 text-white">
        <Sparkles size={12} fill="white" />
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">
          O Mais Vendido
        </span>
      </div>

      <div className="mb-10 text-center">
        <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase">
          Growth
        </span>
        <h3 className="mt-2 text-4xl font-black tracking-tighter uppercase italic">
          {plan.name}
        </h3>
        <div className="mt-6 flex items-baseline justify-center gap-1">
          <span className="text-7xl font-black tracking-tighter italic">
            R$ {plan.price}
          </span>
          <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">
            /mês
          </span>
        </div>
      </div>

      <div className="mb-10 grow space-y-5">
        <div className="flex items-center gap-3 text-sm font-bold italic">
          <CheckCircle2 size={18} className="text-indigo-500" />
          {plan.maxStores === -1
            ? "Lojas Ilimitadas"
            : `${plan.maxStores} Loja(s) Ativa(s)`}
        </div>
        <div className="flex items-center gap-3 text-sm font-bold italic">
          <CheckCircle2 size={18} className="text-indigo-500" />
          {plan.maxProducts === -1
            ? "Produtos Ilimitados"
            : `Até ${plan.maxProducts} Produtos`}
        </div>
        {featuresList.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-sm font-bold italic"
          >
            <CheckCircle2 size={18} className="text-indigo-500" />
            {feature}
          </div>
        ))}
      </div>

      <Link
        href="/signup"
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 py-5 text-xs font-black tracking-widest text-white transition-all hover:bg-indigo-500 active:scale-95 text-center"
      >
        <span className="relative z-10 uppercase italic">Assinar agora</span>
        <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
      </Link>
    </div>
  );
};

const StandardPlanCard = ({
  plan,
  index,
}: {
  plan: SubscriptionPlanResponse;
  index: number;
}) => {
  const featuresList = plan.features?.split(",").map((f) => f.trim()) || [];
  const isBusiness = index === 2;

  return (
    <div className="group relative flex flex-col rounded-[3rem] border border-slate-100 bg-white p-10 transition-all hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5">
      <div className="mb-10">
        <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
          {index === 0 ? "Start" : "Enterprise"}
        </span>
        <h3 className="mt-2 text-3xl font-black tracking-tighter text-slate-950 uppercase italic">
          {plan.name}
        </h3>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-5xl font-black tracking-tighter text-slate-950 italic">
            R$ {plan.price}
          </span>
          <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            /mês
          </span>
        </div>
      </div>

      <div className="mb-10 grow space-y-5">
        <div className="flex items-center gap-3 text-sm font-bold text-slate-500 italic">
          <CheckCircle2
            size={18}
            className="text-slate-300 transition-colors group-hover:text-indigo-600"
          />
          {plan.maxStores === -1
            ? "Lojas Ilimitadas"
            : `${plan.maxStores} Loja(s) Ativa(s)`}
        </div>
        <div className="flex items-center gap-3 text-sm font-bold text-slate-500 italic">
          <CheckCircle2
            size={18}
            className="text-slate-300 transition-colors group-hover:text-indigo-600"
          />
          {plan.maxProducts === -1
            ? "Produtos Ilimitados"
            : `Até ${plan.maxProducts} Produtos`}
        </div>
        {featuresList.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-sm font-bold text-slate-500 italic"
          >
            <CheckCircle2
              size={18}
              className="text-slate-300 transition-colors group-hover:text-indigo-600"
            />
            {feature}
          </div>
        ))}
      </div>

      <Link
        href={isBusiness ? "/contact" : "/signup"}
        className="flex w-full items-center justify-center rounded-2xl border-2 border-slate-950 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-slate-950 hover:text-white active:scale-95 text-center"
      >
        {isBusiness ? "Falar com Consultor" : "Começar Agora"}
      </Link>
    </div>
  );
};

export const SubscriptionPlansSection = () => {
  const { getAllPlans } = useSubscriptionPlan();

  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await getAllPlans(0, 3);
      setPlans(response.content);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Não foi possível carregar os planos no momento.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAllPlans]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <section
      className="relative overflow-hidden bg-white py-32 lg:py-48"
      id="planos"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-100 w-100 rounded-full bg-slate-50/50 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-24 flex flex-col items-start justify-between gap-8 border-b border-slate-100 pb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-indigo-600">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                Escalabilidade Ilimitada
              </span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic md:text-8xl">
              ESCOLHA SEU <br />
              <span className="text-indigo-600">COMBUSTÍVEL.</span>
            </h2>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Modelo de Negócio
            </p>
            <p className="text-xl font-bold text-slate-950 uppercase italic">
              0% Taxa de Faturamento
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Sincronizando ofertas...
            </p>
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-500">
              <AlertTriangle size={40} />
            </div>
            <h3 className="mb-2 text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
              Erro de Conexão.
            </h3>
            <p className="mb-8 text-center text-sm font-medium text-slate-500 max-w-xs uppercase tracking-tight">
              {apiError}
            </p>
            <button
              onClick={fetchPlans}
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 active:scale-95"
            >
              <RefreshCw size={14} /> Tentar Novamente
            </button>
          </div>
        ) : (
          <div className="grid items-center gap-8 lg:grid-cols-3">
            {plans.map((plan, index) =>
              index === 1 ? (
                <FeaturedPlanCard key={plan.id} plan={plan} />
              ) : (
                <StandardPlanCard key={plan.id} plan={plan} index={index} />
              )
            )}
          </div>
        )}

        <div className="mt-20 text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase italic">
            Upgrade ou Downgrade a qualquer momento • Cancelamento sem multas
          </p>
        </div>
      </div>
    </section>
  );
};
