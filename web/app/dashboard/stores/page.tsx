"use client";

import { useCallback } from "react";

import { StoreFilter } from "@/@types/store/store-filter";
import { StoresDashboard } from "@/components/stores-dashboard";
import { getMyStores } from "@/services/stores";

const DashboardPage = () => {
  const fetchMyStores = useCallback(
    (_filters: StoreFilter, page: number, size: number) => getMyStores(page, size),
    [],
  );

  return (
    <StoresDashboard
      fetchFunction={fetchMyStores}
      headerTitle="MINHAS LOJAS"
      headerSubtitle="Console Administrativo Global"
      canCreate={true}
      showStatusFilter={false}
      basePath="/dashboard"
      backPath="/dashboard"
    />
  );
};

export default DashboardPage;
