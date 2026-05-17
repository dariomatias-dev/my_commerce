"use client";

import Link from "next/link";

import { Store } from "lucide-react";

import { OrdersDashboard } from "@/components/orders-dashboard";
import { getMyOrders } from "@/services/orders";

const OrdersPage = () => {
  return (
    <OrdersDashboard
      fetchFn={getMyOrders}
      emptyDescription="Você ainda não realizou nenhuma compra em nossa plataforma."
      actions={
        <Link
          href="/orders/by-store"
          className="group flex h-18 items-center gap-4 rounded-2xl border border-slate-100 bg-white px-8 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase shadow-sm transition-all hover:bg-indigo-600 hover:text-white active:scale-95"
        >
          <Store size={22} className="transition-colors" />
          Filtrar por Loja
        </Link>
      }
    />
  );
};

export default OrdersPage;
