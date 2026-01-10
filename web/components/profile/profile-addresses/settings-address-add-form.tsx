"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LocateFixed, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  ProfileAddressFormValues,
  profileAddressSchema,
} from "@/schemas/profile-address.schema";
import { SettingsAddressForm } from "./settings-address-form";

interface SettingsAddressAddFormProps {
  onAdd: (data: ProfileAddressFormValues) => Promise<void>;
}

export const SettingsAddressAddForm = ({
  onAdd,
}: SettingsAddressAddFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<ProfileAddressFormValues>({
    resolver: zodResolver(profileAddressSchema),
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

  const getCoordinatesFromAddress = async () => {
    const values = form.getValues();

    if (!values.street || !values.city) return;

    const fullAddress = `${values.street}, ${values.number}, ${values.neighborhood}, ${values.city}, ${values.state}, Brasil`;

    try {
      setIsGeocoding(true);

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        fullAddress
      )}&format=json&limit=1`;

      const response = await fetch(url, {
        headers: { "User-Agent": "MeuApp/1.0" },
      });

      const data = await response.json();

      if (data.length > 0) {
        form.setValue("latitude", data[0].lat);
        form.setValue("longitude", data[0].lon);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude.toString());
        form.setValue("longitude", position.coords.longitude.toString());
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  const onSubmit = async (data: ProfileAddressFormValues) => {
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white shadow-sm">
            <Plus size={12} />
          </div>

          <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-widest">
            Novo Endereço de Entrega
          </h3>
        </div>

        <div className="group relative">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-[9px] font-black text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-50 uppercase"
          >
            {isLocating ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <LocateFixed size={12} />
            )}
            Usar GPS do Dispositivo
          </button>

          <div className="pointer-events-none absolute -bottom-10 right-0 w-48 rounded bg-slate-950 p-2 text-[8px] font-bold text-white opacity-0 transition-all group-hover:opacity-100 z-10">
            Captura sua latitude e longitude exatas via satélite agora.
          </div>
        </div>
      </div>

      <SettingsAddressForm
        register={form.register}
        errors={form.formState.errors}
        onSubmit={form.handleSubmit(onSubmit)}
        onGetCoordinates={getCoordinatesFromAddress}
        isGeocoding={isGeocoding}
        isLoading={isLoading}
      />
    </div>
  );
};
