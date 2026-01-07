import {
  ArrowLeft,
  Calendar,
  Clock,
  Hash,
  Package,
  Receipt,
  ShieldCheck,
} from "lucide-react";

import { OrderDetailsResponse } from "@/@types/order/order-details-response";
import { OrderDetailsPageHeaderStatusBadge } from "./order-details-page-header-status-badge";

interface OrderDetailsPageHeaderProps {
  order: OrderDetailsResponse;
  onBack: () => void;
}

export const OrderDetailsPageHeader = ({
  order,
  onBack,
}: OrderDetailsPageHeaderProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar ao Histórico
        </button>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2">
          <Clock size={14} className="text-slate-400" />

          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Atualizado: {new Date(order.updatedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>

      <section className="mb-12 overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col justify-center border-b border-slate-50 p-10 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <OrderDetailsPageHeaderStatusBadge status={order.status} />

              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                <Hash size={12} className="text-slate-400" />

                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {order.id}
                </span>
              </div>
            </div>

            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-950 lg:text-6xl">
              Pedido{" "}
              <span className="text-indigo-600">#{order.id.split("-")[0]}</span>
            </h1>

            <div className="mt-8 flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-indigo-600" />

                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Realizado em
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package size={18} className="text-indigo-600" />

                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Volumes
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "Item" : "Itens"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-10 text-white lg:w-96">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Receipt className="mb-4 text-indigo-400" size={32} />

                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Total do Pedido
                </p>

                <p className="mt-2 text-5xl font-black tracking-tighter">
                  {order.totalAmount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              <div className="mt-10 flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                <ShieldCheck className="shrink-0 text-emerald-400" size={24} />

                <p className="text-[10px] font-bold uppercase leading-tight text-white/70">
                  Pagamento processado em ambiente seguro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
