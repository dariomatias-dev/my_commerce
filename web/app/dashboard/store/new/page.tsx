"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ImagePlus,
  Layout,
  Palette,
  Store,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ElementType, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ApiError } from "@/@types/api";
import { StoreRequest } from "@/@types/store/store-request";
import { ActionButton } from "@/components/buttons/action-button";
import { useStore } from "@/services/hooks/use-store";

const createStoreSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ser mais detalhada"),
  themeColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
  isActive: z.boolean(),
  logo: z.any().refine((files) => files?.length > 0, "A logo é obrigatória"),
  banner: z
    .any()
    .refine((files) => files?.length > 0, "O banner é obrigatório"),
});

type CreateStoreFormValues = z.infer<typeof createStoreSchema>;

const FormSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: React.ReactNode;
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
  preview,
  error,
  onChange,
  icon: Icon,
}: {
  label: string;
  preview: string | null;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ElementType;
}) => (
  <div className="space-y-4">
    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
      {label}
    </label>

    <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-600 hover:bg-indigo-50/30">
      {preview ? (
        <Image src={preview} alt={label} fill className="object-cover" />
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
        className="hidden"
        accept="image/*"
        onChange={onChange}
      />
    </label>

    {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
  </div>
);

const NewStorePage = () => {
  const router = useRouter();

  const { createStore } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      description: "",
      themeColor: "#6366f1",
      isActive: true,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (field === "logo") setLogoPreview(reader.result as string);
        else setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setValue(field, e.target.files);
    }
  };

  const onSubmit = async (values: CreateStoreFormValues) => {
    try {
      setIsLoading(true);
      setGlobalError(null);

      const data: StoreRequest = {
        name: values.name,
        description: values.description,
        themeColor: values.themeColor,
        isActive: values.isActive,
      };

      await createStore(data, values.logo[0], values.banner[0]);

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(error.message);
      } else {
        setGlobalError("Erro ao inicializar nova instância.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900 mx-auto max-w-400 px-6 pt-32 pb-20">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <Link
            href="/dashboard"
            className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar ao Painel
          </Link>

          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-5 items-center rounded bg-indigo-600 px-2 text-[9px] font-black tracking-widest text-white uppercase">
              Nova Infraestrutura
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
              Deploy de Unidade
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
            CRIAR NOVA <span className="text-indigo-600">LOJA.</span>
          </h1>
        </div>

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
                    placeholder="Ex: Minha Loja Tech"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none transition-all"
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
                    placeholder="Descreva o propósito..."
                    className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none transition-all"
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
                  preview={logoPreview}
                  error={errors.logo?.message as string}
                  icon={UploadCloud}
                  onChange={(e) => handleFileChange(e, "logo")}
                />

                <FileUploadField
                  label="Banner Principal"
                  preview={bannerPreview}
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
                      className="h-14 w-14 cursor-pointer overflow-hidden rounded-xl border-none bg-transparent"
                    />
                    <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 font-mono text-xs font-bold uppercase text-slate-600">
                      {watch("themeColor")}
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
              {globalError && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
                  <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
                    {globalError}
                  </p>
                </div>
              )}

              <ActionButton disabled={isLoading} showArrow={!isLoading}>
                {isLoading ? "INICIALIZANDO..." : "CRIAR LOJA"}
              </ActionButton>

              <p className="px-4 text-center text-[9px] font-bold leading-relaxed text-slate-400 uppercase tracking-tight">
                Ao criar uma loja, você concorda com os protocolos de
                infraestrutura.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default NewStorePage;
