"use client";

import { Activity } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useOrder } from "@/services/hooks/use-order";
import { DashboardStatCard } from "../../../../dashboard-stat-card";

interface DashboardSuccessfulSalesStatCardProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardSuccessfulSalesStatCard = ({
  storeId,
  isActive,
}: DashboardSuccessfulSalesStatCardProps) => {
  const { getSuccessfulSalesCountByStoreId } = useOrder();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSalesCount = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getSuccessfulSalesCountByStoreId(storeId);

      setCount(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao tentar buscar os dados");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeId, getSuccessfulSalesCountByStoreId]);

  useEffect(() => {
    fetchSalesCount();
  }, [fetchSalesCount]);

  return (
    <DashboardStatCard
      label="Vendas Bem-sucedidas"
      value={count.toLocaleString()}
      sub="Volume total de pedidos"
      icon={Activity}
      isActive={isActive}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchSalesCount}
    />
  );
};
