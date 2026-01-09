"use client";

import { StoresDashboard } from "@/components/stores-dashboard";
import { useStore } from "@/services/hooks/use-store";

const DashboardPage = () => {
  const { getMyStores } = useStore();

  return (
    <StoresDashboard
      fetchFunction={getMyStores}
      headerTitle="MINHAS LOJAS"
      headerSubtitle="Console Administrativo Global"
      canCreate={true}
      backPath="/dashboard"
    />
  );
};

export default DashboardPage;
