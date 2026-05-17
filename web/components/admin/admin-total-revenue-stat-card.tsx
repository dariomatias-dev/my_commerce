"use client";

import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { getTotalRevenue } from "@/services/analytics";

export const AdminTotalRevenueStatCard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getTotalRevenue();

        if (!ignore) setTotalRevenue(response.total);
      } catch {
        if (!ignore) setErrorMessage("Erro ao carregar métricas de receita.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalRevenue);

  return (
    <DashboardStatCard
      icon={DollarSign}
      label="Receita Total"
      value={formattedValue}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={() => setRefreshKey((k) => k + 1)}
    />
  );
};
