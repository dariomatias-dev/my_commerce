"use client";

import { Banknote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useAnalytics } from "@/services/hooks/use-analytics";
import { DashboardStatCard } from "../../../../dashboard-stat-card";

interface DashboardTotalRevenueStatCardProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardTotalRevenueStatCard = ({
  storeId,
  isActive,
}: DashboardTotalRevenueStatCardProps) => {
  const { getTotalRevenueByStoreId } = useAnalytics();

  const [revenue, setRevenue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getTotalRevenueByStoreId(storeId);

      setRevenue(response.total);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar receita");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getTotalRevenueByStoreId, storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      label="Receita Total"
      value={revenue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      sub="Receita total da loja"
      icon={Banknote}
      isActive={isActive}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
