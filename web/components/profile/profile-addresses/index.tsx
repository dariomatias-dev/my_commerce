"use client";

import { useEffect, useState } from "react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { ApiError } from "@/@types/api";
import { createAddress, deleteAddress } from "@/app/actions/addresses";
import { Feedback } from "@/components/feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { AddressFormValues } from "@/schemas/address.schema";
import { getAllAddresses } from "@/services/addresses";
import { SettingsAddressAddForm } from "./settings-address-add-form";
import { SettingsAddressesList } from "./settings-addresses-list";

export const SettingsAddresses = () => {
  const { feedback, showFeedback, clearFeedback } = useFeedback();

  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchAddresses() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAllAddresses();

        if (!ignore) setAddresses(response);
      } catch (err) {
        if (!ignore) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError("Não foi possível carregar seus endereços.");
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchAddresses();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleAddAddress = async (formData: AddressFormValues) => {
    const requestData = {
      label: formData.label,
      street: formData.street,
      number: formData.number,
      complement: formData.complement || "",
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      zip: formData.cep,
      latitude: formData.latitude ? Number(formData.latitude) : 0,
      longitude: formData.longitude ? Number(formData.longitude) : 0,
    };

    const result = await createAddress(requestData);

    if (!result.success) {
      showFeedback("error", result.error);

      throw new Error(result.error);
    }

    showFeedback("success", "Endereço cadastrado com sucesso.");
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAddress(id);

    if (!result.success) {
      showFeedback("error", result.error);

      return;
    }

    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    showFeedback("success", "Endereço removido com sucesso.");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-50 pb-4">
        <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
          Meus Endereços
        </h2>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Gestão de Logística e Localização
        </p>
      </div>

      <SettingsAddressesList
        addresses={addresses}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        onRetry={() => setRefreshKey((k) => k + 1)}
      />

      {feedback && (
        <Feedback
          type={feedback.type}
          message={feedback.message}
          onClose={clearFeedback}
        />
      )}

      <SettingsAddressAddForm onAdd={handleAddAddress} />
    </div>
  );
};
