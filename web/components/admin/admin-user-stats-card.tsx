"use client";

import { Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useUser } from "@/services/hooks/use-user";
import { StatCard } from "../stat-card";

export const AdminUserStatsCard = () => {
  const { getActiveUsersCount, getNewActiveUsersThisMonth } = useUser();

  const [data, setData] = useState({ total: 0, trend: "0%" });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [totalActive, newActive] = await Promise.all([
        getActiveUsersCount(),
        getNewActiveUsersThisMonth(),
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
        setErrorMessage("Erro ao carregar métricas de usuários.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getActiveUsersCount, getNewActiveUsersThisMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <StatCard
      icon={<Users size={24} />}
      label="Usuários Ativos"
      value={data.total.toLocaleString()}
      trend={data.trend}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
