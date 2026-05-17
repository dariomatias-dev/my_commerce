"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { AddressForm } from "@/components/address-form";
import { AddressFormValues, addressSchema } from "@/schemas/address.schema";

interface SettingsAddressAddFormProps {
  onAdd: (data: AddressFormValues) => Promise<void>;
}

export const SettingsAddressAddForm = ({ onAdd }: SettingsAddressAddFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
    },
  });

  const handleSyncCoordinates = () => {
    if (!navigator.geolocation) {
      setSyncError("Geolocalização não suportada neste navegador.");
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude.toString(), {
          shouldDirty: true,
        });
        form.setValue("longitude", position.coords.longitude.toString(), {
          shouldDirty: true,
        });
        setIsSyncing(false);
      },
      (error) => {
        setIsSyncing(false);
        if (error.code === error.PERMISSION_DENIED) {
          setSyncError("Permissão de localização negada pelo navegador.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setSyncError("Localização indisponível no momento.");
        } else {
          setSyncError("Não foi possível obter a localização.");
        }
      },
      { timeout: 10000 },
    );
  };

  const onSubmit = async (data: AddressFormValues) => {
    try {
      setIsLoading(true);
      await onAdd(data);
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-100 p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white shadow-sm">
          <Plus size={12} />
        </div>

        <h3 className="text-[10px] font-black tracking-widest text-slate-950 uppercase">
          Novo Endereço de Entrega
        </h3>
      </div>

      <AddressForm
        register={form.register}
        errors={form.formState.errors}
        onSubmit={form.handleSubmit(onSubmit)}
        onGetCoordinates={handleSyncCoordinates}
        isGeocoding={isSyncing}
        syncError={syncError}
        isLoading={isLoading}
      />
    </div>
  );
};
