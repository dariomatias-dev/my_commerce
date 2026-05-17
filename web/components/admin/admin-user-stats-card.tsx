"use client";

import { useEffect, useState } from "react";

import { Users } from "lucide-react";

import { ApiError } from "@/@types/api";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { getActiveUsersCount } from "@/services/users";

export const AdminUserStatsCard = () => {
  const [totalActive, setTotalActive] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getActiveUsersCount();

        if (!ignore) setTotalActive(response);
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Erro ao carregar métricas de usuários.");
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
  }, [refreshKey]);

  return (
    <DashboardStatCard
      icon={Users}
      label="Usuários Ativos"
      value={totalActive.toLocaleString()}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={() => setRefreshKey((k) => k + 1)}
    />
  );
};
