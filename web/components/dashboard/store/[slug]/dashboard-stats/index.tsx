import { DashboardActiveProductsStatCard } from "./dashboard-active-products-stat-card";
import { DashboardTotalRevenueStatCard } from "./dashboard-total-revenue-stat-card";
import { DashboardSuccessfulSalesStatCard } from "./dashboard-successful-sales-stat-card";
import { DashboardUniqueCustomersStatCard } from "./dashboard-unique-customers-stat-card";

interface DashboardStatsProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardStats = ({ storeId, isActive }: DashboardStatsProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardSuccessfulSalesStatCard storeId={storeId} isActive={isActive} />

      <DashboardActiveProductsStatCard storeId={storeId} isActive={isActive} />

      <DashboardUniqueCustomersStatCard storeId={storeId} isActive={isActive} />

      <DashboardTotalRevenueStatCard storeId={storeId} isActive={isActive} />
    </div>
  );
};
