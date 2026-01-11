"use client";

import { DollarSign, ShieldCheck, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AdminAuditLogTable } from "@/components/admin/admin-audit-log-table";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminStoreStatsCard } from "@/components/admin/admin-store-stats-card";
import { AdminUserStatsCard } from "@/components/admin/admin-user-stats-card";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { useOrder } from "@/services/hooks/use-order";

const AdminDashboard = () => {
  const { getAllOrders } = useOrder();

  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const ordersRes = await getAllOrders(0, 1);

      setTotalOrders(ordersRes.totalElements || 0);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Falha na sincronização dos dados estatísticos.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAllOrders]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (isLoading) {
    return <LoadingIndicator message="Carregando console operacional..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Erro de"
        highlightedTitle="Sincronização"
        errorMessage={errorMessage}
        onRetry={fetchDashboardStats}
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

      <AdminAuditLogTable />
    </main>
  );
};

export default AdminDashboard;
