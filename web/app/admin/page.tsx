"use client";

import {
  Activity,
  AlertCircle,
  CreditCard,
  DollarSign,
  History,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderResponse } from "@/@types/order/order-response";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminStoreStatsCard } from "@/components/admin/admin-store-stats-card";
import { AdminUserStatsCard } from "@/components/admin/admin-user-stats-card";
import { LoadingIndicator } from "@/components/loading-indicator";
import { useOrder } from "@/services/hooks/use-order";

interface AuditLog {
  id: number;
  action: string;
  user: string;
  date: string;
  status: "success" | "danger" | "warning";
}

const AdminDashboard = () => {
  const { getAllOrders } = useOrder();

  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const ordersRes = await getAllOrders(0, 5);

      setRecentOrders(ordersRes.content || []);
      setTotalOrders(ordersRes.totalElements || 0);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Falha crítica na sincronização do console.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAllOrders]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
      id: 1,
      action: "Login",
      user: "admin@system.com",
      date: "Há 2 min",
      status: "success",
    },
    {
      id: 2,
      action: "Delete Store",
      user: "staff@system.com",
      date: "Há 15 min",
      status: "danger",
    },
    {
      id: 3,
      action: "Update Plan",
      user: "user@client.com",
      date: "Há 1 hora",
      status: "warning",
    },
  ];

  if (isLoading) {
    return <LoadingIndicator message="Carregando dados..." />;
  }

  if (errorMessage) {
    return (
      <main className="grow bg-white pb-40 pt-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 text-red-500 shadow-xl shadow-red-100">
            <AlertCircle size={48} />
          </div>

          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
            Erro de <span className="text-red-500">Integridade</span>
          </h2>

          <p className="mt-4 max-w-xs text-xs font-bold uppercase tracking-widest text-slate-400">
            {errorMessage}
          </p>

          <button
            onClick={fetchDashboardData}
            className="mt-10 flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600"
          >
            <RefreshCcw size={16} />
            Reiniciar Console
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="grow bg-[#FBFBFC] pb-40 pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-16">
          <div className="mb-4 flex w-fit items-center gap-3 rounded-full bg-indigo-50 px-4 py-2">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
              Sistema de Governança
            </span>
          </div>

          <h1 className="text-7xl font-black uppercase italic tracking-tighter text-slate-950 md:text-8xl">
            Admin <span className="text-indigo-600">Console.</span>
          </h1>
        </header>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            icon={<DollarSign size={24} />}
            label="Volume Total"
            value="R$ 142.580"
            trend="+12.5%"
          />

          <AdminUserStatsCard />

          <AdminStoreStatsCard />

          <AdminStatCard
            icon={<TrendingUp size={24} />}
            label="Pedidos/Dia"
            value={totalOrders.toString()}
            trend="+14.1%"
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
                  Transações <span className="text-indigo-600">Recentes</span>
                </h2>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">
                Ver Tudo
              </button>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      ID Ordem
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Data
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Valor
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="group transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-8 py-5 text-xs font-black uppercase italic text-slate-950">
                        #{order.id.split("-")[0]}
                      </td>
                      <td className="px-8 py-5 text-[11px] font-bold uppercase text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-slate-950">
                        R$ {order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                          Confirmado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <History size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
                Auditoria
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {MOCK_AUDIT_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                      {log.action}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-slate-400">
                      {log.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                      <Activity size={14} />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600">
                      {log.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
