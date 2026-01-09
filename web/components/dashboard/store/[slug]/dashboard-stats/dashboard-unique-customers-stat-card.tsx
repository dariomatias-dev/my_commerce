"use client";

import { Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useAnalytics } from "@/services/hooks/use-analytics";
import { DashboardStatCard } from "../../../../dashboard-stat-card";

interface DashboardUniqueCustomersStatCardProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardUniqueCustomersStatCard = ({
  storeId,
  isActive,
}: DashboardUniqueCustomersStatCardProps) => {
  const { getUniqueCustomersByStoreId } = useAnalytics();

  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getUniqueCustomersByStoreId(storeId);

      setTotalCustomers(response.total);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar clientes");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getUniqueCustomersByStoreId, storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      label="Clientes Totais"
      value={totalCustomers.toLocaleString()}
      sub="Clientes únicos da loja"
      icon={Users}
      isActive={isActive}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
