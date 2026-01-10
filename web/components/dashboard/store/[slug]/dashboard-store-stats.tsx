import { useAnalytics } from "@/services/hooks/use-analytics";
import { useOrder } from "@/services/hooks/use-order";
import { useProduct } from "@/services/hooks/use-product";

import { DashboardActiveProductsStatCard } from "../../../dashboard-stats/dashboard-active-products-stat-card";
import { DashboardSuccessfulSalesStatCard } from "../../../dashboard-stats/dashboard-successful-sales-stat-card";
import { DashboardTotalRevenueStatCard } from "../../../dashboard-stats/dashboard-total-revenue-stat-card";
import { DashboardUniqueCustomersStatCard } from "../../../dashboard-stats/dashboard-unique-customers-stat-card";

interface DashboardStoreStatsProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardStoreStats = ({ storeId }: DashboardStoreStatsProps) => {
  const { getActiveProductsCount } = useProduct();
  const { getUniqueCustomersByStoreId, getTotalRevenueByStoreId } =
    useAnalytics();
  const { getSuccessfulSalesCountByStoreId } = useOrder();

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardSuccessfulSalesStatCard
        request={() => getSuccessfulSalesCountByStoreId(storeId)}
      />

      <DashboardActiveProductsStatCard
        request={() => getActiveProductsCount(storeId)}
      />

      <DashboardUniqueCustomersStatCard
        request={() => getUniqueCustomersByStoreId(storeId)}
      />

      <DashboardTotalRevenueStatCard
        request={() => getTotalRevenueByStoreId(storeId)}
      />
    </div>
  );
};
