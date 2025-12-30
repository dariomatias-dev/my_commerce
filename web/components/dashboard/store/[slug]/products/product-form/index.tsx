"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, DollarSign, Type } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { CategoryResponse } from "@/@types/category/category-response";
import { ProductResponse } from "@/@types/product/product-response";
import { ActionButton } from "@/components/buttons/action-button";
import { ProductMediaGallery } from "@/components/dashboard/store/[slug]/products/product-form/product-media-gallery";
import { ProductFormValues, productSchema } from "@/schemas/product.schema";
import { useCategory } from "@/services/hooks/use-category";
import { useStore } from "@/services/hooks/use-store";
import { ProductFormCategorySelect } from "./product-form-category";
import { ProductFormField } from "./product-form-field";
import { ProductFormSection } from "./product-form-section";
import { ProductStatusToggleSection } from "./product-status-toggle-section";

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
  const [existingImages, setExistingImages] = useState<string[]>([]);

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
    if (!isLoadingData) trigger("images");
  }, [existingImages, setValue, trigger, isLoadingData]);

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
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        stock: initialData.stock,
        categoryId: initialData.categoryId,
        active: initialData.active,
        images: [],
        existingCount: initialData.images.length,
      });

      const images = initialData.images.map((image) => {
        return image.url;
      });
      setExistingImages(images);
    }
  }, [initialData, reset]);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  const handleRemoveExisting = (imageName: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageName));
    setRemovedImages((prev) => [...prev, imageName]);
  };

  return (
    <form
      onSubmit={handleSubmit(
        (data) =>
          storeId &&
          onSubmit(
            data,
            storeId,
            removedImages.length > 0 ? removedImages : undefined
          )
      )}
      className="space-y-8"
    >
      <ProductFormSection>
        <div className="grid gap-10">
          <ProductFormField
            label="Nome do Produto"
            icon={Type}
            error={errors.name?.message}
          >
            <input
              {...register("name")}
              placeholder="Ex: Alpha Pro Sneakers v2"
              className={`w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-900 outline-none transition-all focus:bg-white ${
                errors.name
                  ? "border-red-500"
                  : "border-slate-100 focus:border-indigo-600"
              }`}
            />
          </ProductFormField>

          <ProductFormCategorySelect
            name="categoryId"
            categories={categories}
            isLoading={isLoadingData}
            error={errors.categoryId?.message}
            setValue={setValue}
            watch={watch}
          />

          <ProductFormField
            label="Descrição"
            error={errors.description?.message}
          >
            <textarea
              {...register("description")}
              rows={6}
              className={`w-full resize-none rounded-[2rem] border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 outline-none transition-all focus:bg-white ${
                errors.description
                  ? "border-red-500"
                  : "border-slate-100 focus:border-indigo-600"
              }`}
            />
          </ProductFormField>
        </div>
      </ProductFormSection>

      <ProductMediaGallery
        watch={watch}
        setValue={setValue}
        error={errors.images?.message as string}
        existingImages={existingImages}
        onRemoveExisting={handleRemoveExisting}
      />

      <ProductFormSection>
        <div className="grid gap-10 md:grid-cols-2">
          <ProductFormField label="Preço (R$)" icon={DollarSign}>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 border-slate-100 outline-none focus:border-indigo-600"
            />
          </ProductFormField>
          <ProductFormField label="Estoque" icon={Box}>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              className="w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 border-slate-100 outline-none focus:border-indigo-600"
            />
          </ProductFormField>
        </div>
      </ProductFormSection>

      <ProductStatusToggleSection
        isActive={isActive}
        onToggle={(value) => setValue("active", value)}
      />

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
