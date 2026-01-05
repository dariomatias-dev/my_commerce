"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { ApiError } from "@/@types/api";
import { ProfileAddressFormValues } from "@/schemas/profile-address.schema";
import { useUserAddress } from "@/services/hooks/use-user-address";
import { ProfileAddressAddForm } from "./profile-address-add-form";
import { ProfileAddressesList } from "./profile-addresses-list";

export const ProfileAddresses = () => {
  const { getAllAddresses, deleteAddress, createAddress } = useUserAddress();

  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
    setFeedback(null);
    try {
      const requestData = {
        label: "Principal",
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

      setFeedback({
        message: "Endereço cadastrado com sucesso.",
        type: "success",
      });

      await fetchAddresses();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cadastrar endereço.";
      setFeedback({ message, type: "error" });
      throw new Error(message);
    }
  };

  const handleDelete = async (id: string) => {
    setFeedback(null);
    try {
      await deleteAddress(id);

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));

      setFeedback({
        message: "Endereço removido com sucesso.",
        type: "success",
      });
    } catch (err) {
      setFeedback({
        message:
          err instanceof ApiError ? err.message : "Erro ao remover endereço.",
        type: "error",
      });
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

      <ProfileAddressesList
        addresses={addresses}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        onRetry={fetchAddresses}
      />

      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 transition-all animate-in fade-in slide-in-from-top-2 ${
            feedback.type === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-600"
              : "border-red-100 bg-red-50 text-red-600"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <p className="text-[10px] font-black uppercase tracking-widest">
            {feedback.message}
          </p>
          <button
            onClick={() => setFeedback(null)}
            className="ml-auto text-[10px] font-black uppercase opacity-50 hover:opacity-100"
          >
            Fechar
          </button>
        </div>
      )}

      <ProfileAddressAddForm onAdd={handleAddAddress} />
    </div>
  );
};
