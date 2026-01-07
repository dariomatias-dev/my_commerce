"use client";

import { BarChart3 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useAnalytics } from "@/services/hooks/use-analytics";
import { DashboardStatCard } from "../../../../dashboard-stat-card";

interface DashboardConversionStatCardProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardConversionStatCard = ({
  storeId,
  isActive,
}: DashboardConversionStatCardProps) => {
  const { getConversionRateByStoreId } = useAnalytics();

  const [rate, setRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getConversionRateByStoreId(storeId);

      setRate(response.conversionRate);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro de métricas");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getConversionRateByStoreId, storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      label="Taxa de Conversão"
      value={`${rate.toFixed(2)}%`}
      sub="Visitantes que viraram clientes"
      icon={BarChart3}
      isActive={isActive}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
