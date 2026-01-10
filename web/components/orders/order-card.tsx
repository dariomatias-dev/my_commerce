"use client";

import { Calendar, ChevronRight, Hash, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { OrderResponse } from "@/@types/order/order-response";
import { getOrderStatusConfig } from "@/utils/get-order-status-config";

interface OrderCardProps {
  order: OrderResponse;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const statusConfig = getOrderStatusConfig(order.status);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 transition-all hover:border-indigo-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-slate-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            <ShoppingBag size={28} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-slate-300" />
              <span className="text-sm font-black uppercase tracking-tighter text-slate-950">
                ID: {order.id.split("-")[0]}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-300" />
              <span className="text-[10px] leading-none font-bold uppercase tracking-widest text-slate-400">
                {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col items-end border-r border-slate-100 pr-6">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
              Itens
            </span>
            <span className="text-xl font-black text-slate-950">
              {String(order.itemsCount || 0).padStart(2, "0")}
            </span>
          </div>

          <div
            className={`rounded-full px-5 py-2 transition-colors ${statusConfig.bg} ${statusConfig.color}`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {statusConfig.label}
            </span>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white">
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </Link>
  );
};
