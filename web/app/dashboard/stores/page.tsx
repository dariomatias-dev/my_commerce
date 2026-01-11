"use client";

import { useCallback } from "react";

import { StoreFilter } from "@/@types/store/store-filter";
import { StoresDashboard } from "@/components/stores-dashboard";
import { useStore } from "@/services/hooks/use-store";

const DashboardPage = () => {
  const { getMyStores } = useStore();

  const fetchMyStores = useCallback(
    (_filters: StoreFilter, page: number, size: number) =>
      getMyStores(page, size),
    [getMyStores]
  );

  return (
    <StoresDashboard
      fetchFunction={fetchMyStores}
      headerTitle="MINHAS LOJAS"
      headerSubtitle="Console Administrativo Global"
      canCreate={true}
      showStatusFilter={false}
      backPath="/dashboard"
    />
  );
};

export default DashboardPage;
