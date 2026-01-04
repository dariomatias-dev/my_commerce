"use client";

import { useParams } from "next/navigation";

import { EditStoreForm } from "@/components/stores-dashboard/store-dashboard/edit-store-form";

const AdminEditStorePage = () => {
  const { userId, storeSlug } = useParams() as {
    userId: string;
    storeSlug: string;
  };

  return (
    <EditStoreForm
      storeSlug={storeSlug}
      backPath={`/admin/users/${userId}/stores/${storeSlug}`}
      successPath={`/admin/users/${userId}/stores`}
    />
  );
};

export default AdminEditStorePage;
