"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, RefreshCw, Trash2 } from "lucide-react";
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
});

type AddressFormValues = z.infer<typeof addressSchema>;

export const ProfileAddressForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      street: "Av. Paulista",
      number: "1000",
      city: "São Paulo",
      state: "SP",
      cep: "01310-100",
    },
  ]);

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
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAddresses((prev) => [
        ...prev,
        { ...data, id: Math.random().toString() },
      ]);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-50 pb-4">
        <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
          Meus Endereços
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Locais de entrega e faturamento
        </p>
      </div>

      <div className="grid gap-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <MapPin size={16} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-950 uppercase">
                  {addr.street}, {addr.number}
                </h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  {addr.city} - {addr.state} | {addr.cep}
                </p>
              </div>
            </div>
            <button className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-dashed border-slate-100 p-6">
        <div className="mb-6 flex items-center gap-2">
          <Plus size={14} className="text-indigo-600" />
          <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-widest">
            Adicionar Novo Endereço
          </h3>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1.5 md:col-span-1">
              <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                CEP
              </label>
              <input
                {...form.register("cep")}
                placeholder="00000-000"
                className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Logradouro
              </label>
              <input
                {...form.register("street")}
                placeholder="Rua, Avenida..."
                className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all text-sm"
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
                placeholder="123"
                className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Complemento
              </label>
              <input
                {...form.register("complement")}
                placeholder="Apto, Bloco..."
                className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all text-sm"
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
                className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                Cidade
              </label>
              <input
                {...form.register("city")}
                className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                UF
              </label>
              <input
                {...form.register("state")}
                maxLength={2}
                placeholder="EX"
                className="w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all text-sm uppercase"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-[9px] font-black tracking-widest text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              CADASTRAR ENDEREÇO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
