"use client";

import { useParams } from "next/navigation";

import { EditStoreForm } from "@/components/stores-dashboard/store-dashboard/edit-store-form";

const EditStorePage = () => {
  const { storeSlug } = useParams() as { storeSlug: string };

  return (
    <EditStoreForm
      storeSlug={storeSlug}
      backPath="/dashboard"
      successPath="/dashboard"
    />
  );
};

export default EditStorePage;
