"use client";

import { DollarSign } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { getTotalRevenue } from "@/services/analytics";

export const AdminTotalRevenueStatCard = () => {

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getTotalRevenue();
      setTotalRevenue(response.total);
    } catch {
      setErrorMessage("Erro ao carregar métricas de receita.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      onRetry={fetchData}
    />
  );
};
