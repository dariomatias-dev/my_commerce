"use client";

import { PackageSearch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useProduct } from "@/services/hooks/use-product";
import { DashboardStatCard } from "./dashboard-stat-card";

interface DashboardActiveProductsStatCardProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardActiveProductsStatCard = ({
  storeId,
  isActive,
}: DashboardActiveProductsStatCardProps) => {
  const { getActiveProductsCount } = useProduct();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getActiveProductsCount(storeId);

      setCount(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao tentar buscar os dados");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getActiveProductsCount, storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      label="Produtos Ativos"
      value={count.toLocaleString()}
      sub="Itens disponíveis na loja"
      icon={PackageSearch}
      isActive={isActive}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
