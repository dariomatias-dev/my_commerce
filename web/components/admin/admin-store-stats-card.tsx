"use client";

import { Store } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { useStore } from "@/services/hooks/use-store";

export const AdminStoreStatsCard = () => {
  const { getTotalActiveStores } = useStore();

  const [totalActive, setTotalActive] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getTotalActiveStores();

      setTotalActive(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar métricas de lojas.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getTotalActiveStores]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      icon={Store}
      label="Lojas Ativas"
      value={totalActive.toLocaleString()}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
