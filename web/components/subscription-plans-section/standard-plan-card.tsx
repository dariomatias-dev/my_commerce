"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";

interface StandardPlanCardProps {
  plan: SubscriptionPlanResponse;
  index: number;
  onSelect: () => void;
  isLoading: boolean;
  isActive: boolean;
}

export const StandardPlanCard = ({
  plan,
  index,
  onSelect,
  isLoading,
  isActive,
}: StandardPlanCardProps) => {
  const featuresList =
    plan.features
      ?.split(";")
      .map((f) => f.trim())
      .filter(Boolean) || [];

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

      <button
        onClick={onSelect}
        disabled={isLoading || isActive}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-950 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-slate-950 hover:text-white active:scale-95 text-center disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isActive ? (
          "Seu Plano Atual"
        ) : isBusiness ? (
          "Falar com Consultor"
        ) : (
          "Começar Agora"
        )}
      </button>
    </div>
  );
};
