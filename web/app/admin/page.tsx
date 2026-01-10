"use client";

import {
  Activity,
  CreditCard,
  DollarSign,
  History,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { OrderResponse } from "@/@types/order/order-response";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminStoreStatsCard } from "@/components/admin/admin-store-stats-card";
import { AdminUserStatsCard } from "@/components/admin/admin-user-stats-card";
import { ErrorFeedback } from "@/components/error-feedback";
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
    return <LoadingIndicator message="Carregando dados operacionais..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Erro de"
        highlightedTitle="Integridade"
        errorMessage={errorMessage}
        onRetry={fetchDashboardData}
        backPath="/dashboard"
        backLabel="VOLTAR AO PAINEL"
      />
    );
  }

  return (
    <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
      <div className="mb-12 border-b border-slate-200 pb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
            <ShieldCheck size={10} />
            ADMIN_CONSOLE
          </div>
          <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
            Sistema de governança e monitoramento global
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic md:text-5xl">
          GERENCIAMENTO <span className="text-indigo-600">CENTRALIZADO.</span>
        </h1>
      </div>

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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg">
                <CreditCard size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
                Transações <span className="text-indigo-600">Recentes</span>
              </h2>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-indigo-600">
              Ver Tudo
            </button>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
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
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg">
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
                className="flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-100"
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
                  <p className="text-[11px] font-bold text-slate-600 truncate">
                    {log.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AdminDashboard;
