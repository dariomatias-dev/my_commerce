import { BarChart3, Cpu } from "lucide-react";

import { ActiveProductsStatCard } from "./active-products-stat-card";
import { DashboardStatCard } from "./dashboard-stat-card";
import { SuccessfulSalesStatCard } from "./successful-sales-stat-card";

interface DashboardStatsProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardStats = ({ storeId, isActive }: DashboardStatsProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SuccessfulSalesStatCard storeId={storeId} isActive={isActive} />

      <ActiveProductsStatCard storeId={storeId} isActive={isActive} />

      <DashboardStatCard
        label="Taxa de Requisições"
        value="1.240 req/s"
        sub="Pico de processamento"
        icon={Cpu}
        isActive={isActive}
      />

      <DashboardStatCard
        label="Conversão Global"
        value="0.00%"
        sub="Métrica em sincronização"
        icon={BarChart3}
        isActive={isActive}
      />
    </div>
  );
};
