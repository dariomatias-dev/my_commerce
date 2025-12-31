"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Layout, Palette, Store, UploadCloud } from "lucide-react";
import Image from "next/image";
import { ElementType, ReactNode, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { StoreResponse } from "@/@types/store/store-response";
import { ActionButton } from "@/components/buttons/action-button";

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

const FormSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: ReactNode;
}) => (
  <section className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm">
    <div className="mb-8 flex items-center gap-3 border-b border-slate-50 pb-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase italic">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

const FileUploadField = ({
  label,
  file,
  existingUrl,
  error,
  onChange,
  icon: Icon,
}: {
  label: string;
  file?: FileList;
  existingUrl: string | null;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ElementType;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const handlePreviewUpdate = () => {
      if (file && file.length > 0) {
        const url = URL.createObjectURL(file[0]);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
      setPreview(existingUrl);
    };

    const cleanup = handlePreviewUpdate();
    return () => {
      if (cleanup) cleanup();
    };
  }, [file, existingUrl]);

  return (
    <div className="space-y-4">
      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </label>

      <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-600 hover:bg-indigo-50/30">
        {preview ? (
          <Image
            src={preview}
            alt={label}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-600">
            <Icon size={32} />
            <span className="text-[10px] font-black tracking-widest uppercase">
              Upload {label.split(" ")[0]}
            </span>
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={onChange}
        />
      </label>

      {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
    </div>
  );
};

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
        <FormSection title="Dados da Instância" icon={Store}>
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
        </FormSection>

        <FormSection title="Assets Visuais" icon={Layout}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FileUploadField
              label="Logo da Loja (1:1)"
              file={logoFile}
              existingUrl={existingLogo}
              error={errors.logo?.message as string}
              icon={UploadCloud}
              onChange={(e) => handleFileChange(e, "logo")}
            />

            <FileUploadField
              label="Banner Principal"
              file={bannerFile}
              existingUrl={existingBanner}
              error={errors.banner?.message as string}
              icon={ImagePlus}
              onChange={(e) => handleFileChange(e, "banner")}
            />
          </div>
        </FormSection>
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
              ? "ATUALIZAR UNIDADE"
              : "CRIAR LOJA"}
          </ActionButton>
        </div>
      </aside>
    </form>
  );
};
