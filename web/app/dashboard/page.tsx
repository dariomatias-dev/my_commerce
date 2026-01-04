"use client";

import { StoreManagement } from "@/components/store-management";
import { useStore } from "@/services/hooks/use-store";

const DashboardPage = () => {
  const { getMyStores, deleteStore } = useStore();

  return (
    <StoreManagement
      fetchFunction={getMyStores}
      deleteFunction={deleteStore}
      headerTitle="MINHAS LOJAS"
      headerSubtitle="Console Administrativo Global"
      canCreate={true}
    />
  );
};

export default DashboardPage;
