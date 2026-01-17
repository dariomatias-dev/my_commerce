"use client";

import { Info, Plus, RefreshCw, Search, Tag } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { AddressFormValues } from "@/schemas/address.schema";
import { AddressFormInput } from "./address-form-input";

interface AddressFormProps {
  register: UseFormRegister<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onGetCoordinates: () => void;
  isGeocoding: boolean;
  isLoading: boolean;
}

export const AddressForm = ({
  register,
  errors,
  onSubmit,
  onGetCoordinates,
  isGeocoding,
  isLoading,
}: AddressFormProps) => {
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
      <div className="grid gap-4 md:grid-cols-1">
        <AddressFormInput
          label="Identificação do Endereço"
          register={register("label")}
          error={errors.label?.message}
          placeholder="Ex: Casa, Escritório, Apartamento no Centro..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <AddressFormInput
          label="CEP"
          register={register("cep")}
          error={errors.cep?.message}
          onInput={handleCepFormat}
          placeholder="01010-000"
          maxLength={9}
        />

        <AddressFormInput
          label="Logradouro"
          className="md:col-span-3"
          register={register("street")}
          error={errors.street?.message}
          placeholder="Rua, Avenida Paulista"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AddressFormInput
          label="Número"
          register={register("number")}
          error={errors.number?.message}
          onInput={handleOnlyNumbers}
          placeholder="1578"
        />

        <AddressFormInput
          label="Complemento"
          className="md:col-span-2"
          register={register("complement")}
          placeholder="Ex: Apto 101, Bloco B, Sala 1202"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AddressFormInput
          label="Bairro"
          register={register("neighborhood")}
          error={errors.neighborhood?.message}
          placeholder="Bela Vista"
        />

        <AddressFormInput
          label="Cidade"
          register={register("city")}
          error={errors.city?.message}
          placeholder="São Paulo"
        />

        <AddressFormInput
          label="UF"
          register={register("state")}
          error={errors.state?.message}
          maxLength={2}
          placeholder="SP"
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-slate-950 bg-slate-950 p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Tag size={14} className="text-white" />
            </div>

            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">
              Posicionamento Geográfico
            </h4>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            <span className="text-[8px] font-bold uppercase tracking-tighter text-indigo-400">
              Sistema GPS Ativo
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative rounded-xl bg-slate-900/50 p-3 border border-slate-800">
            <label className="mb-1 block text-[8px] font-black uppercase tracking-widest text-slate-500">
              Coordenada Latitude
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-600">LAT</span>
              <input
                {...register("latitude")}
                readOnly
                className="w-full bg-transparent font-mono text-sm font-black text-white outline-none"
                placeholder="0.000000"
              />
            </div>
          </div>

          <div className="relative rounded-xl bg-slate-900/50 p-3 border border-slate-800">
            <label className="mb-1 block text-[8px] font-black uppercase tracking-widest text-slate-500">
              Coordenada Longitude
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-600">LON</span>
              <input
                {...register("longitude")}
                readOnly
                className="w-full bg-transparent font-mono text-sm font-black text-white outline-none"
                placeholder="0.000000"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
          <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-slate-500">
            <Info size={10} className="text-indigo-600" />
            Vincule as coordenadas para otimizar a logística de entrega.
          </p>

          <button
            type="button"
            onClick={onGetCoordinates}
            disabled={isGeocoding}
            className="flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-[9px] font-black text-slate-950 transition-all hover:bg-indigo-600 hover:text-white disabled:opacity-50 uppercase"
          >
            {isGeocoding ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Search size={12} />
            )}
            Sincronizar Mapa
          </button>
        </div>
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
          Finalizar Cadastro
        </button>
      </div>
    </form>
  );
};
