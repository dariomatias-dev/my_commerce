"use client";

import { DollarSign, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AdminAuditLogTable } from "@/components/admin/admin-audit-log-table";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminStoreStatsCard } from "@/components/admin/admin-store-stats-card";
import { AdminUserStatsCard } from "@/components/admin/admin-user-stats-card";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { useOrder } from "@/services/hooks/use-order";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";

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
    return <LoadingIndicator message="Carregando dados..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Erro de"
        highlightedTitle="Sincronização"
        errorMessage={errorMessage}
        onRetry={fetchDashboardStats}
        backPath="/admin"
        backLabel="VOLTAR AO PAINEL"
      />
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-400 px-6 pt-32 pb-12">
      <DashboardPageHeader
        title="GERENCIAMENTO CENTRALIZADO"
        subtitle="Sistema de governança e monitoramento"
        label="Administração"
      />

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
