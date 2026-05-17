"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminAuditLogTable } from "@/components/admin/admin-audit-log-table";
import { AdminStoreStatsCard } from "@/components/admin/admin-store-stats-card";
import { AdminTotalRevenueStatCard } from "@/components/admin/admin-total-revenue-stat-card";
import { AdminUserStatsCard } from "@/components/admin/admin-user-stats-card";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { ErrorFeedback } from "@/components/error-feedback";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { getAllOrders } from "@/services/orders";

const AdminDashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchDashboardStats() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const ordersRes = await getAllOrders(0, 1);

        if (!ignore) setTotalOrders(ordersRes.totalElements || 0);
      } catch {
        if (!ignore)
          setErrorMessage("Falha na sincronização dos dados estatísticos.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchDashboardStats();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  if (isLoading) {
    return <LoadingIndicator message="Carregando dados..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Erro de"
        highlightedTitle="Sincronização"
        errorMessage={errorMessage}
        onRetry={() => setRefreshKey((k) => k + 1)}
        backPath="/admin"
        backLabel="VOLTAR AO PAINEL"
      />
    );
  }

  return (
    <>
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
    </>
  );
};

export default AdminDashboard;
