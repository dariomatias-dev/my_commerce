"use client";

import { Banknote } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { DashboardStatCard } from "../dashboard-stat-card";

interface DashboardTotalRevenueStatCardProps {
  request: () => Promise<{ total: number }>;
}

export const DashboardTotalRevenueStatCard = ({
  request,
}: DashboardTotalRevenueStatCardProps) => {
  const [revenue, setRevenue] = useState(0);
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

        if (!ignore) setRevenue(response.total);
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Erro ao carregar receita");
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
      label="Receita Total"
      value={revenue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      icon={Banknote}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={() => setRefreshKey((k) => k + 1)}
    />
  );
};
