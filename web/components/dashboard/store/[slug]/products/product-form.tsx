"use client";

import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ChevronDown, DollarSign, Layers, Type } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { CategoryResponse } from "@/@types/category/category-response";
import { ProductResponse } from "@/@types/product/product-response";
import { ActionButton } from "@/components/buttons/action-button";
import { ProductMediaGallery } from "@/components/dashboard/store/[slug]/products/new/product-gallery";
import { useCategory } from "@/services/hooks/use-category";
import { useStore } from "@/services/hooks/use-store";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY!,
  },
  forcePathStyle: process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE === "true",
});

const productSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    description: z.string().min(10, "A descrição deve ser mais detalhada"),
    price: z.number().min(0.01, "O preço deve ser maior que zero"),
    stock: z.number().int().min(0, "O estoque não pode ser negativo"),
    categoryId: z.string().min(1, "Selecione uma categoria"),
    active: z.boolean(),
    images: z.array(z.any()),
    existingCount: z.number(),
  })
  .refine((data) => data.images.length + data.existingCount > 0, {
    message: "O produto precisa ter pelo menos uma imagem",
    path: ["images"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductResponse;
  onSubmit: (
    data: ProductFormValues,
    storeId: string,
    removedImages?: string[]
  ) => Promise<void>;
  isSubmitting: boolean;
  slug: string;
}

export const ProductForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  slug,
}: ProductFormProps) => {
  const { getStoreBySlug } = useStore();
  const { getCategoriesByStoreId } = useCategory();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    { name: string; url: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      active: true,
      price: 0,
      stock: 0,
      images: [],
      existingCount: 0,
    },
  });

  const isActive = watch("active");

  useEffect(() => {
    setValue("existingCount", existingImages.length);
    if (isLoadingData === false) {
      trigger("images");
    }
  }, [existingImages, setValue, trigger, isLoadingData]);

  const fetchExistingImages = useCallback(async () => {
    if (!initialData?.slug) return;

    try {
      const prefix = `${slug}/products/${initialData.slug}/`;
      const command = new ListObjectsV2Command({
        Bucket: "stores",
        Prefix: prefix,
      });

      const response = await s3Client.send(command);

      if (response.Contents) {
        const images = response.Contents.map((item) => {
          const fileName = item.Key?.split("/").pop() || "";
          return {
            name: fileName,
            url: `http://localhost:9000/stores/${item.Key}`,
          };
        }).filter((img) => img.name !== "");

        setExistingImages(images);
      }
    } catch (error) {
      console.error(error);
    }
  }, [initialData?.slug, slug]);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        stock: initialData.stock,
        categoryId: initialData.categoryId,
        active: initialData.active,
        images: [],
        existingCount: 0,
      });
      fetchExistingImages();
    }
  }, [initialData, reset, fetchExistingImages]);

  const fetchDependencies = useCallback(async () => {
    try {
      setIsLoadingData(true);

      const storeData = await getStoreBySlug(slug);
      setStoreId(storeData.id);

      const catData = await getCategoriesByStoreId(storeData.id, 0, 100);
      setCategories(catData.content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  }, [slug, getStoreBySlug, getCategoriesByStoreId]);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  const handleFormSubmit = (data: ProductFormValues) => {
    if (storeId) {
      onSubmit(
        data,
        storeId,
        removedImages.length > 0 ? removedImages : undefined
      );
    }
  };

  const handleRemoveExisting = (imageName: string) => {
    setExistingImages((prev) => prev.filter((img) => img.name !== imageName));
    setRemovedImages((prev) => [...prev, imageName]);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
        <div className="grid gap-10">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Type size={12} /> Nome do Produto
            </label>
            <input
              {...register("name")}
              placeholder="Ex: Alpha Pro Sneakers v2"
              className={`w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-900 outline-none transition-all focus:bg-white ${
                errors.name
                  ? "border-red-500"
                  : "border-slate-100 focus:border-indigo-600"
              }`}
            />
            {errors.name && (
              <p className="text-[10px] font-bold text-red-500 uppercase ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Layers size={12} /> Categoria Vinculada
            </label>
            <div className="relative">
              <select
                {...register("categoryId")}
                disabled={isLoadingData}
                className={`w-full appearance-none rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 outline-none transition-all focus:bg-white ${
                  errors.categoryId
                    ? "border-red-500"
                    : "border-slate-100 focus:border-indigo-600"
                }`}
              >
                <option value="">
                  {isLoadingData
                    ? "Carregando..."
                    : "Selecione uma categoria..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Descrição
            </label>
            <textarea
              {...register("description")}
              rows={6}
              className={`w-full resize-none rounded-[2rem] border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 outline-none transition-all focus:bg-white ${
                errors.description
                  ? "border-red-500"
                  : "border-slate-100 focus:border-indigo-600"
              }`}
            />
          </div>
        </div>
      </section>

      <ProductMediaGallery
        watch={watch}
        setValue={setValue}
        error={errors.images?.message as string}
        existingImages={existingImages}
        onRemoveExisting={handleRemoveExisting}
      />

      <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <DollarSign size={12} /> Preço (R$)
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 border-slate-100 outline-none focus:border-indigo-600"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Box size={12} /> Estoque
            </label>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              className="w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 border-slate-100 outline-none focus:border-indigo-600"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black tracking-widest text-slate-950 uppercase">
            Publicação Ativa
          </p>
          <button
            type="button"
            onClick={() => setValue("active", !isActive)}
            className={`relative h-8 w-14 rounded-full transition-all ${
              isActive ? "bg-indigo-600" : "bg-slate-200"
            }`}
          >
            <div
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
                isActive ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      <ActionButton
        disabled={isSubmitting || isLoadingData}
        showArrow={!isSubmitting}
      >
        {isSubmitting
          ? "SINCRONIZANDO..."
          : initialData
          ? "ATUALIZAR DADOS"
          : "FINALIZAR CADASTRO"}
      </ActionButton>
    </form>
  );
};
