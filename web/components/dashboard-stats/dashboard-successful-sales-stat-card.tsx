"use client";

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await request();

        if (!ignore) setCount(response);
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Erro ao tentar buscar os dados");
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [refreshKey, request]);

  return (
    <DashboardStatCard
      label="Vendas Bem-sucedidas"
      value={count.toLocaleString()}
      icon={Activity}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={() => setRefreshKey((k) => k + 1)}
    />
  );
};
