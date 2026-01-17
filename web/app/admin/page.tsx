"use client";

import { TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AdminAuditLogTable } from "@/components/admin/admin-audit-log-table";
import { AdminStoreStatsCard } from "@/components/admin/admin-store-stats-card";
import { AdminTotalRevenueStatCard } from "@/components/admin/admin-total-revenue-stat-card";
import { AdminUserStatsCard } from "@/components/admin/admin-user-stats-card";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { ErrorFeedback } from "@/components/error-feedback";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
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
        <AdminTotalRevenueStatCard />

        <AdminUserStatsCard />

        <AdminStoreStatsCard />

        <DashboardStatCard
          icon={TrendingUp}
          label="Pedidos Concluídos Totais"
          value={totalOrders.toString()}
        />
      </div>

      <AdminAuditLogTable />
    </main>
  );
};

export default AdminDashboard;
