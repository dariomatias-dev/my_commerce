import { ArrowRight } from "lucide-react";

interface OrderDetailsFinancialSummaryProps {
  subtotal: number;
  freight: number;
  total: number;
  freightType: string;
}

export const OrderDetailsFinancialSummary = ({
  subtotal,
  freight,
  total,
  freightType,
}: OrderDetailsFinancialSummaryProps) => {
  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-xl font-black uppercase italic tracking-tighter text-slate-950">
        Resumo de Valores
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Subtotal Produtos
          </span>

          <span className="text-sm font-bold text-slate-950">
            {subtotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Frete ({freightType})
          </span>

          <span className="text-sm font-bold text-emerald-500">
            {freight === 0
              ? "GRÁTIS"
              : freight.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </span>
        </div>

        <div className="my-6 border-t border-dashed border-slate-100" />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Valor Total Pago
          </span>

          <span className="text-5xl font-black tracking-tighter text-indigo-600">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>

      <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 p-5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-slate-950 hover:shadow-xl active:scale-95">
        Suporte ao Pedido <ArrowRight size={16} />
      </button>
    </div>
  );
};
