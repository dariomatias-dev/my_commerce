"use client";

import { useParams } from "next/navigation";

import { StoresDashboard } from "@/components/stores-dashboard";
import { useStore } from "@/services/hooks/use-store";

const AdminUserStoresPage = () => {
  const { userId } = useParams() as { userId: string };

  const { getAllByUser } = useStore();

  return (
    <StoresDashboard
      fetchFunction={getAllByUser}
      userId={userId}
      headerTitle="LOJAS DO USUÁRIO"
      headerSubtitle="Supervisão de Infraestrutura"
      canCreate={false}
      showStatusFilter={true}
      backPath="/admin/users"
    />
  );
};

export default AdminUserStoresPage;
