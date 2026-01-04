"use client";

import { StoresDashboard } from "@/components/stores-dashboard";
import { useStore } from "@/services/hooks/use-store";

const DashboardPage = () => {
  const { getMyStores, deleteStore } = useStore();

  return (
    <StoresDashboard
      fetchFunction={getMyStores}
      deleteFunction={deleteStore}
      headerTitle="MINHAS LOJAS"
      headerSubtitle="Console Administrativo Global"
      canCreate={true}
    />
  );
};

export default DashboardPage;
