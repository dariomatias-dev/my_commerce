"use client";

import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";

interface FeaturedPlanCardProps {
  plan: SubscriptionPlanResponse;
  onSelect: () => void;
  isLoading: boolean;
  isActive: boolean;
}

export const FeaturedPlanCard = ({
  plan,
  onSelect,
  isLoading,
  isActive,
}: FeaturedPlanCardProps) => {
  const featuresList =
    plan.features
      ?.split(";")
      .map((f) => f.trim())
      .filter(Boolean) || [];

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

      <button
        onClick={onSelect}
        disabled={isLoading || isActive}
        className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 py-5 text-xs font-black tracking-widest text-white transition-all hover:bg-indigo-500 active:scale-95 text-center disabled:opacity-50 disabled:pointer-events-none"
      >
        <div className="relative z-10 flex items-center gap-2 uppercase italic">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isActive ? (
            "Seu Plano Atual"
          ) : (
            "Assinar agora"
          )}
        </div>

        {!isLoading && !isActive && (
          <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
        )}
      </button>
    </div>
  );
};
