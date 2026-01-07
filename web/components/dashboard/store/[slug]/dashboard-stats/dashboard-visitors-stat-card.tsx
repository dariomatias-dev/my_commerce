"use client";

import { Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { useAnalytics } from "@/services/hooks/use-analytics";
import { DashboardStatCard } from "../../../../dashboard-stat-card";

interface DashboardVisitorsStatCardProps {
  storeId: string;
  isActive: boolean;
}

export const DashboardVisitorsStatCard = ({
  storeId,
  isActive,
}: DashboardVisitorsStatCardProps) => {
  const { getVisitorsPerHourByStoreId } = useAnalytics();

  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getVisitorsPerHourByStoreId(storeId);

      const total = response.reduce((acc, curr) => acc + curr.count, 0);

      setTotalVisitors(total);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro de tráfego");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getVisitorsPerHourByStoreId, storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardStatCard
      label="Tráfego"
      value={totalVisitors.toLocaleString()}
      sub="Visitantes nas últimas 24h"
      icon={Users}
      isActive={isActive}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={fetchData}
    />
  );
};
