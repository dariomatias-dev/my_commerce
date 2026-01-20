"use client";

import { Store } from "lucide-react";
import Link from "next/link";

import { OrdersDashboard } from "@/components/orders-dashboard";
import { useOrder } from "@/services/hooks/use-order";

const OrdersPage = () => {
  const { getMyOrders } = useOrder();

  return (
    <OrdersDashboard
      fetchFn={getMyOrders}
      emptyDescription="Você ainda não realizou nenhuma compra em nossa plataforma."
      actions={
        <Link
          href="/orders/by-store"
          className="group flex h-18 items-center gap-4 rounded-2xl bg-white border border-slate-100 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white active:scale-95 shadow-sm"
        >
          <Store size={22} className="transition-colors" />
          Filtrar por Loja
        </Link>
      }
    />
  );
};

export default OrdersPage;
