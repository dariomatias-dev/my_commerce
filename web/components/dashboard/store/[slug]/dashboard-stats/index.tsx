import { DashboardActiveProductsStatCard } from "./dashboard-active-products-stat-card";
import { DashboardConversionStatCard } from "./dashboard-conversion-stat-card";
import { DashboardSuccessfulSalesStatCard } from "./dashboard-successful-sales-stat-card";
import { DashboardVisitorsStatCard } from "./dashboard-visitors-stat-card";

interface DashboardStatsProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardStats = ({ storeId, isActive }: DashboardStatsProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardSuccessfulSalesStatCard storeId={storeId} isActive={isActive} />

      <DashboardActiveProductsStatCard storeId={storeId} isActive={isActive} />

      <DashboardVisitorsStatCard storeId={storeId} isActive={isActive} />

      <DashboardConversionStatCard storeId={storeId} isActive={isActive} />
    </div>
  );
};
