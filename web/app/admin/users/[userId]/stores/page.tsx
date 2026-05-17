"use client";

import { useParams } from "next/navigation";

import { StoresDashboard } from "@/components/stores-dashboard";
import { getAllByUser } from "@/services/stores";

const AdminUserStoresPage = () => {
  const { userId } = useParams() as { userId: string };

  return (
    <StoresDashboard
      fetchFunction={getAllByUser}
      userId={userId}
      headerTitle="LOJAS DO USUÁRIO"
      headerSubtitle="Supervisão de Infraestrutura"
      canCreate={false}
      showStatusFilter={true}
      backPath="/admin/users"
      basePath={`/admin/users/${userId}`}
    />
  );
};

export default AdminUserStoresPage;
