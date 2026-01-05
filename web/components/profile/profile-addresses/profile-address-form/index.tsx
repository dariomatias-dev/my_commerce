"use client";

import { Info, Plus, RefreshCw, Search } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileAddressFormValues } from "@/schemas/profile-address.schema";
import { ProfileAddressInput } from "./profile-address-input";

interface ProfileAddressFormProps {
  register: UseFormRegister<ProfileAddressFormValues>;
  errors: FieldErrors<ProfileAddressFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onGetCoordinates: () => void;
  isGeocoding: boolean;
  isLoading: boolean;
}

export const ProfileAddressForm = ({
  register,
  errors,
  onSubmit,
  onGetCoordinates,
  isGeocoding,
  isLoading,
}: ProfileAddressFormProps) => {
  const handleCepFormat = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    e.currentTarget.value = value;
  };

  const handleOnlyNumbers = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <ProfileAddressInput
          label="CEP"
          register={register("cep")}
          error={errors.cep?.message}
          onInput={handleCepFormat}
          placeholder="01010-000"
          maxLength={9}
        />

        <ProfileAddressInput
          label="Logradouro"
          className="md:col-span-3"
          register={register("street")}
          error={errors.street?.message}
          placeholder="Rua, Avenida Paulista"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ProfileAddressInput
          label="Número"
          register={register("number")}
          error={errors.number?.message}
          onInput={handleOnlyNumbers}
          placeholder="1578"
        />

        <ProfileAddressInput
          label="Complemento"
          className="md:col-span-2"
          register={register("complement")}
          placeholder="Ex: Apto 101, Bloco B, Sala 1202"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ProfileAddressInput
          label="Bairro"
          register={register("neighborhood")}
          error={errors.neighborhood?.message}
          placeholder="Bela Vista"
        />

        <ProfileAddressInput
          label="Cidade"
          register={register("city")}
          error={errors.city?.message}
          placeholder="São Paulo"
        />

        <ProfileAddressInput
          label="UF"
          register={register("state")}
          error={errors.state?.message}
          maxLength={2}
          placeholder="SP"
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-slate-950 p-4 shadow-inner md:flex-row md:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="ml-1 flex items-center gap-1 text-[8px] font-black tracking-widest text-slate-500 uppercase">
            Latitude <Info size={10} />
          </label>
          <input
            {...register("latitude")}
            readOnly
            className="w-full bg-transparent font-mono text-xs font-bold text-indigo-400 outline-none"
            placeholder="0.000000"
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <label className="ml-1 flex items-center gap-1 text-[8px] font-black tracking-widest text-slate-500 uppercase">
            Longitude <Info size={10} />
          </label>
          <input
            {...register("longitude")}
            readOnly
            className="w-full bg-transparent font-mono text-xs font-bold text-indigo-400 outline-none"
            placeholder="0.000000"
          />
        </div>

        <button
          type="button"
          onClick={onGetCoordinates}
          disabled={isGeocoding}
          className="flex h-10 items-center gap-2 rounded-lg border border-indigo-600/30 bg-transparent px-4 text-[9px] font-black text-indigo-400 transition-all hover:bg-indigo-600 hover:text-white disabled:opacity-50 uppercase"
        >
          {isGeocoding ? (
            <RefreshCw size={12} className="animate-spin" />
          ) : (
            <Search size={12} />
          )}
          Vincular Coordenadas
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-4 text-[10px] font-black tracking-widest text-white shadow-xl transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50 uppercase"
        >
          {isLoading ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Salvar Endereço
        </button>
      </div>
    </form>
  );
};
