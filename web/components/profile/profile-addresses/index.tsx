"use client";

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

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAllAddresses();

      setAddresses(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
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
        label: "Principal",
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zip: formData.cep,
        latitude: formData.latitude ? Number(formData.latitude) : 0,
        longitude: formData.longitude ? Number(formData.longitude) : 0,
      };

      await createAddress(requestData);
      await fetchAddresses();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert("Erro ao cadastrar endereço.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert("Erro ao remover endereço.");
      }
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

      <ProfileAddressAddForm onAdd={handleAddAddress} />
    </div>
  );
};
