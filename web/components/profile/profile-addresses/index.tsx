"use client";

import { useCallback, useEffect, useState } from "react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { ApiError } from "@/@types/api";
import { Feedback } from "@/components/feedback";
import { useFeedback } from "@/hooks/use-feedback";
import { ProfileAddressFormValues } from "@/schemas/profile-address.schema";
import { useUserAddress } from "@/services/hooks/use-user-address";
import { SettingsAddressAddForm } from "./settings-address-add-form";
import { SettingsAddressesList } from "./settings-addresses-list";

export const SettingsAddresses = () => {
  const { feedback, showFeedback, clearFeedback } = useFeedback();

  const { getAllAddresses, deleteAddress, createAddress } = useUserAddress();

  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAllAddresses();

      setAddresses(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar seus endereços.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAllAddresses]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = async (formData: ProfileAddressFormValues) => {
    try {
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

      await createAddress(requestData);

      showFeedback("success", "Endereço cadastrado com sucesso.");

      await fetchAddresses();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cadastrar endereço.";

      showFeedback("error", message);

      throw new Error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));

      showFeedback("success", "Endereço removido com sucesso.");
    } catch (err) {
      showFeedback(
        "error",
        err instanceof ApiError ? err.message : "Erro ao remover endereço."
      );
    }
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
        onRetry={fetchAddresses}
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
