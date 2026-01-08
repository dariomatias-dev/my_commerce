"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";

import { StoresDashboard } from "@/components/stores-dashboard";
import { useStore } from "@/services/hooks/use-store";

const AdminUserStoresPage = () => {
  const { userId } = useParams() as {
    userId: string;
  };

  const { getAllByUser } = useStore();

  const fetchUserStores = useCallback(
    (page: number, size: number) => getAllByUser({ userId }, page, size),
    [userId, getAllByUser]
  );

  return (
    <StoresDashboard
      fetchFunction={fetchUserStores}
      headerTitle="LOJAS DO USUÁRIO"
      headerSubtitle="Supervisão de Infraestrutura Vinculada"
      canCreate={false}
    />
  );
};

export default AdminUserStoresPage;
