"use client";

import { RefreshCw, Timer, Truck } from "lucide-react";

import {
  FreightOption,
  FreightResponse,
} from "@/@types/freight/freight-response";

interface CheckoutFreightSectionProps {
  options: FreightResponse | null;
  selectedOption: FreightOption | null;
  onSelect: (option: FreightOption) => void;
  isLoading: boolean;
}

export const CheckoutFreightSection = ({
  options,
  selectedOption,
  onSelect,
  isLoading,
}: CheckoutFreightSectionProps) => {
  if (!options && !isLoading) return null;

  return (
    <section className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 md:p-10 transition-all hover:border-indigo-100">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Truck size={24} />
        </div>

        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
            Método de <span className="text-indigo-600">Envio.</span>
          </h2>

          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Selecione a velocidade de entrega
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <RefreshCw size={24} className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {options &&
            [options.economical, options.express].map((option) => (
              <button
                key={option?.type}
                onClick={() => onSelect(option)}
                className={`relative flex flex-col gap-1 rounded-2xl border-2 p-6 text-left transition-all ${
                  selectedOption?.type === option?.type
                    ? "border-indigo-600 bg-indigo-50/30"
                    : "border-slate-50 bg-slate-50 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      selectedOption?.type === option?.type
                        ? "text-indigo-600"
                        : "text-slate-400"
                    }`}
                  >
                    {option?.type === "ECONOMICAL" ? "Econômico" : "Expresso"}
                  </span>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Timer size={12} />

                    <span className="text-[10px] font-bold">
                      {option?.estimatedDays} dias
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-lg font-black text-slate-950">
                  {option?.value === 0 ? (
                    <span className="text-emerald-500 italic uppercase">
                      Grátis
                    </span>
                  ) : (
                    option?.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  )}
                </p>
              </button>
            ))}
        </div>
      )}
    </section>
  );
};
