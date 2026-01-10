"use client";

import { Banknote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await request();
      setRevenue(response.total);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar receita");
      }
    } finally {
      setIsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      onRetry={fetchData}
    />
  );
};
