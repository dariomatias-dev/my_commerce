"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { DashboardStatCard } from "../dashboard-stat-card";

interface DashboardUniqueCustomersStatCardProps {
  request: () => Promise<{ total: number }>;
}

export const DashboardUniqueCustomersStatCard = ({
  request,
}: DashboardUniqueCustomersStatCardProps) => {
  const [totalCustomers, setTotalCustomers] = useState(0);
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

        if (!ignore) setTotalCustomers(response.total);
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Erro ao carregar clientes");
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
      label="Clientes Totais"
      value={totalCustomers.toLocaleString()}
      icon={Users}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={() => setRefreshKey((k) => k + 1)}
    />
  );
};
