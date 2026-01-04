"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";

import { StoreManagement } from "@/components/store-management";
import { useStore } from "@/services/hooks/use-store";

const AdminUserStoresPage = () => {
  const params = useParams();
  const userId = params.userId as string;

  const { getAllByUser, deleteStore } = useStore();

  const fetchUserStores = useCallback(
    (page: number, size: number) => getAllByUser({ userId }, page, size),
    [userId, getAllByUser]
  );

  return (
    <StoreManagement
      fetchFunction={fetchUserStores}
      deleteFunction={deleteStore}
      headerTitle="LOJAS DO USUÁRIO"
      headerSubtitle="Supervisão de Infraestrutura Vinculada"
      canCreate={false}
    />
  );
};

export default AdminUserStoresPage;
