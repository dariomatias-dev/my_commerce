"use client";

import { Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { useUser } from "@/services/hooks/use-user";

export const AdminUserStatsCard = () => {
  const { getActiveUsersCount } = useUser();

  const [totalActive, setTotalActive] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getActiveUsersCount();

      setTotalActive(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar métricas de usuários.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getActiveUsersCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      icon={Users}
      label="Usuários Ativos"
      value={totalActive.toLocaleString()}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
