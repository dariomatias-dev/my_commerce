"use client";

import { Store } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { useStore } from "@/services/hooks/use-store";

export const AdminStoreStatsCard = () => {
  const { getTotalActiveStores, getNewActiveStoresThisMonth } = useStore();

  const [data, setData] = useState({ total: 0, trend: "0%" });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [totalActive, newActive] = await Promise.all([
        getTotalActiveStores(),
        getNewActiveStoresThisMonth(),
      ]);

      const previousTotal = totalActive - newActive;
      const percentage =
        previousTotal > 0
          ? ((newActive / previousTotal) * 100).toFixed(1)
          : newActive > 0
          ? "100"
          : "0";

      setData({ total: totalActive, trend: `+${percentage}%` });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar métricas de lojas.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getTotalActiveStores, getNewActiveStoresThisMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      icon={Store}
      label="Lojas Ativas"
      value={data.total.toLocaleString()}
      sub={data.trend}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
