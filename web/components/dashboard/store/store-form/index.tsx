"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Layout, Palette, Store, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { StoreResponse } from "@/@types/store/store-response";
import { ActionButton } from "@/components/buttons/action-button";
import { StoreFileUploadField } from "./store-file-upload-field";
import { StoreFormSection } from "./store-form-section";

const storeSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ser mais detalhada"),
  themeColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  isActive: z.boolean(),
  logo: z.any().optional(),
  banner: z.any().optional(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

interface StoreFormProps {
  initialData?: StoreResponse;
  onSubmit: (values: StoreFormValues) => Promise<void>;
  isLoading: boolean;
}

export const StoreForm = ({
  initialData,
  onSubmit,
  isLoading,
}: StoreFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      description: "",
      themeColor: "#6366f1",
      isActive: true,
    },
  });

  const [existingLogo, setExistingLogo] = useState<string | null>(null);
  const [existingBanner, setExistingBanner] = useState<string | null>(null);

  const logoFile = useWatch({ control, name: "logo" });
  const bannerFile = useWatch({ control, name: "banner" });
  const themeColor = useWatch({ control, name: "themeColor" });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "banner"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue(field, files, { shouldValidate: true });
    }
  };

  useEffect(() => {
    const initializeFormData = () => {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description,
          themeColor: initialData.themeColor,
          isActive: initialData.isActive,
        });

        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stores/${initialData.slug}`;
        setExistingLogo(`${baseUrl}/logo.jpeg`);
        setExistingBanner(`${baseUrl}/banner.jpeg`);
      }
    };

    initializeFormData();
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
    >
      <div className="space-y-8 lg:col-span-8">
        <StoreFormSection title="Dados da Instância" icon={Store}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Nome da Loja
              </label>
              <input
                {...register("name")}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
              />
              {errors.name && (
                <p className="ml-1 text-[10px] font-bold text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Descrição Operacional
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
              />
              {errors.description && (
                <p className="ml-1 text-[10px] font-bold text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </StoreFormSection>

        <StoreFormSection title="Assets Visuais" icon={Layout}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <StoreFileUploadField
              label="Logo da Loja (1:1)"
              file={logoFile}
              existingUrl={existingLogo}
              error={errors.logo?.message as string}
              icon={UploadCloud}
              onChange={(e) => handleFileChange(e, "logo")}
            />

            <StoreFileUploadField
              label="Banner Principal"
              file={bannerFile}
              existingUrl={existingBanner}
              error={errors.banner?.message as string}
              icon={ImagePlus}
              onChange={(e) => handleFileChange(e, "banner")}
            />
          </div>
        </StoreFormSection>
      </div>

      <aside className="space-y-8 lg:col-span-4">
        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
            <Palette size={18} className="text-indigo-600" />
            <h3 className="text-sm font-black tracking-widest text-slate-950 uppercase italic">
              Customização
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Cor de Identidade
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  {...register("themeColor")}
                  className="h-14 w-14 cursor-pointer rounded-xl border-none bg-transparent"
                />
                <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 font-mono text-xs font-bold uppercase text-slate-600">
                  {themeColor}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">
                Status Ativo
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 transition-all after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <ActionButton disabled={isLoading} showArrow={!isLoading}>
            {isLoading
              ? "SINCRONIZANDO..."
              : initialData
              ? "ATUALIZAR LOJA"
              : "CRIAR LOJA"}
          </ActionButton>
        </div>
      </aside>
    </form>
  );
};
