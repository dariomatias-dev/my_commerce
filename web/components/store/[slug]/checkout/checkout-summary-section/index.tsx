"use client";

import { CheckCircle2, Loader2, Truck } from "lucide-react";

import { ActionButton } from "@/components/buttons/action-button";
import { Item } from "@/components/store/[slug]/store-header/store-cart/store-cart-item";
import { CheckoutItem } from "./checkout-item";

interface CheckoutSummarySectionProps {
  items: Item[];
  subtotal: number;
  freightValue: number;
  total: number;
  isSubmitting: boolean;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onFinish: () => void;
}

export const CheckoutSummarySection = ({
  items,
  subtotal,
  freightValue,
  total,
  isSubmitting,
  onIncrease,
  onDecrease,
  onRemove,
  onFinish,
}: CheckoutSummarySectionProps) => {
  return (
    <div className="sticky top-10 flex flex-col gap-6">
      <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
            Resumo
          </h2>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-black text-white">
            {items.reduce((a, b) => a + b.quantity, 0)}
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-8 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <CheckoutItem
              key={item.id}
              item={item}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-50 pt-6">
          <div className="flex justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Subtotal
            </span>

            <span className="text-xs font-black text-slate-950">
              {subtotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Truck size={12} /> Frete
            </span>

            <span
              className={`text-xs font-black uppercase italic ${
                freightValue === 0 ? "text-emerald-500" : "text-slate-950"
              }`}
            >
              {freightValue === 0
                ? "Grátis"
                : freightValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
              Total Final
            </span>

            <span className="text-3xl font-black tracking-tighter text-slate-950">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <ActionButton
            onClick={onFinish}
            disabled={isSubmitting || items.length === 0}
            showArrow
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Finalizar Pedido"
            )}
          </ActionButton>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Compra 100% Criptografada
          </span>
        </div>
      </div>
    </div>
  );
};
