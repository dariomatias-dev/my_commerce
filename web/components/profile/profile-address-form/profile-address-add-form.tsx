"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, LocateFixed, Plus, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const addressSchema = z.object({
  cep: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Nº é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "UF inválida"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressAddFormProps {
  onAdd: (data: AddressFormValues) => void;
}

export const AddressAddForm = ({ onAdd }: AddressAddFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

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
        headers: {
          "User-Agent": "MeuApp/1.0 (matiastests0@gmail.com)",
        },
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

  const onSubmit = async (data: AddressFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onAdd(data);
    form.reset();
    setIsLoading(false);
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-100 p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white">
            <Plus size={12} />
          </div>
          <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-widest">
            NOVA INSTÂNCIA DE ENTREGA
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
          <div className="pointer-events-none absolute -bottom-10 right-0 w-48 rounded bg-slate-950 p-2 text-[8px] font-bold text-white opacity-0 transition-all group-hover:opacity-100">
            Captura sua latitude e longitude exatas via satélite agora.
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1.5">
            <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              CEP
            </label>
            <input
              {...form.register("cep")}
              className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm"
            />
          </div>
          <div className="space-y-1.5 md:col-span-3">
            <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Logradouro
            </label>
            <input
              {...form.register("street")}
              className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Número
            </label>
            <input
              {...form.register("number")}
              className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Complemento
            </label>
            <input
              {...form.register("complement")}
              placeholder="Ex: Apto 101, Bloco B"
              className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Bairro
            </label>
            <input
              {...form.register("neighborhood")}
              className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Cidade
            </label>
            <input
              {...form.register("city")}
              className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              UF
            </label>
            <input
              {...form.register("state")}
              maxLength={2}
              className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm uppercase"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl bg-slate-950 p-4 shadow-inner md:flex-row md:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="ml-1 flex items-center gap-1 text-[8px] font-black tracking-widest text-slate-500 uppercase">
              Latitude <Info size={10} />
            </label>
            <input
              {...form.register("latitude")}
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
              {...form.register("longitude")}
              readOnly
              className="w-full bg-transparent font-mono text-xs font-bold text-indigo-400 outline-none"
              placeholder="0.000000"
            />
          </div>
          <button
            type="button"
            onClick={getCoordinatesFromAddress}
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
    </div>
  );
};
