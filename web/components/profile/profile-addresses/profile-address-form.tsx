"use client";

import { Info, Plus, RefreshCw, Search } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileAddressFormValues } from "@/schemas/profile-address.schema";

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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-1.5">
          <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            CEP
          </label>

          <input
            {...register("cep")}
            className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm transition-all"
          />

          {errors.cep && (
            <span className="ml-1 text-[8px] font-bold text-red-500 uppercase">
              {errors.cep.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-3">
          <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Logradouro
          </label>

          <input
            {...register("street")}
            className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm transition-all"
          />

          {errors.street && (
            <span className="ml-1 text-[8px] font-bold text-red-500 uppercase">
              {errors.street.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Número
          </label>

          <input
            {...register("number")}
            className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm transition-all"
          />

          {errors.number && (
            <span className="ml-1 text-[8px] font-bold text-red-500 uppercase">
              {errors.number.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Complemento
          </label>

          <input
            {...register("complement")}
            placeholder="Ex: Apto 101, Bloco B"
            className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm transition-all"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Bairro
          </label>

          <input
            {...register("neighborhood")}
            className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm transition-all"
          />

          {errors.neighborhood && (
            <span className="ml-1 text-[8px] font-bold text-red-500 uppercase">
              {errors.neighborhood.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Cidade
          </label>

          <input
            {...register("city")}
            className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm transition-all"
          />

          {errors.city && (
            <span className="ml-1 text-[8px] font-bold text-red-500 uppercase">
              {errors.city.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            UF
          </label>

          <input
            {...register("state")}
            maxLength={2}
            className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm uppercase transition-all"
          />

          {errors.state && (
            <span className="ml-1 text-[8px] font-bold text-red-500 uppercase">
              {errors.state.message}
            </span>
          )}
        </div>
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
          Obter Localização
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
