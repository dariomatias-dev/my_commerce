"use client";

import { Activity } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { DashboardStatCard } from "../dashboard-stat-card";

interface DashboardSuccessfulSalesStatCardProps {
  request: () => Promise<number>;
}

export const DashboardSuccessfulSalesStatCard = ({
  request,
}: DashboardSuccessfulSalesStatCardProps) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await request();
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
  }, [request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      label="Vendas Bem-sucedidas"
      value={count.toLocaleString()}
      icon={Activity}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
