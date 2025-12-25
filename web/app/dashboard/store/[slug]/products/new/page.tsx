"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Box,
  ChevronDown,
  DollarSign,
  ImagePlus,
  Layers,
  Type,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { ApiError } from "@/@types/api";
import { CategoryResponse } from "@/@types/category/category-response";
import { ActionButton } from "@/components/buttons/action-button";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";
import { useCategory } from "@/services/hooks/use-category";
import { useStore } from "@/services/hooks/use-store";

const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ser mais detalhada"),
  price: z.number().min(0.01, "O preço deve ser maior que zero"),
  stock: z.number().int().min(0, "O estoque não pode ser negativo"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  active: z.boolean(),
  images: z
    .array(z.custom<File>((val) => val instanceof File))
    .min(1, "Adicione pelo menos uma imagem"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductPage = () => {
  const { slug } = useParams() as { slug: string };

  const { getStoreBySlug } = useStore();
  const { getCategoriesByStoreId } = useCategory();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      active: true,
      price: 0,
      stock: 0,
      images: [],
    },
  });

  const isActive = watch("active");
  const selectedImages = watch("images");

  const fetchDependencies = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const storeData = await getStoreBySlug(slug);
      setStoreId(storeData.id);

      const catData = await getCategoriesByStoreId(storeData.id, 0, 100);
      setCategories(catData.content);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Falha ao carregar parâmetros da loja.");
      }
    } finally {
      setIsLoadingData(false);
    }
  }, [slug, getStoreBySlug, getCategoriesByStoreId]);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...selectedImages, ...files];
      setValue("images", newImages, { shouldValidate: true });

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setValue("images", newImages, { shouldValidate: true });
    setPreviews(newPreviews);
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    if (!storeId) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      const formData = new FormData();
      data.images.forEach((file) => formData.append("images", file));

      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        active: data.active,
        storeId,
      };

      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Erro ao registrar produto no inventário.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DashboardHeader />

      <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900 mx-auto max-w-350 px-6 pt-32 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
            <div>
              <Link
                href={`/dashboard/store/${slug}/products`}
                className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={14} /> Voltar ao Inventário
              </Link>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-5 items-center rounded bg-indigo-600 px-2 text-[9px] font-black tracking-widest text-white uppercase">
                  Novo Ativo
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
                  Registro de Unidade
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                CRIAR <span className="text-indigo-600">PRODUTO.</span>
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="lg:col-span-8 space-y-8">
              <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
                <div className="grid gap-10">
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
                      <Type size={12} /> Título do Produto
                    </label>
                    <input
                      {...register("name")}
                      placeholder="Ex: Alpha Pro Sneakers v2"
                      className={`w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-900 outline-none transition-all focus:bg-white ${
                        errors.name
                          ? "border-red-500"
                          : "border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5"
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
                    {errors.categoryId && (
                      <p className="text-[10px] font-bold text-red-500 uppercase ml-1">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Descrição e Especificações
                    </label>
                    <textarea
                      {...register("description")}
                      rows={6}
                      placeholder="Descreva as características do produto..."
                      className={`w-full resize-none rounded-[2rem] border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 outline-none transition-all focus:bg-white ${
                        errors.description
                          ? "border-red-500"
                          : "border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-[10px] font-bold text-red-500 uppercase ml-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
                <label className="mb-6 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Galeria de Mídia
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((url, index) => (
                    <div
                      key={url}
                      className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-slate-100"
                    >
                      <Image
                        src={url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 h-7 w-7 flex items-center justify-center rounded-lg bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-600 hover:bg-indigo-50/30">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      className="sr-only"
                    />
                    <ImagePlus size={24} className="text-slate-400" />
                    <span className="mt-2 text-[10px] font-black text-slate-400 uppercase">
                      Adicionar Imagem
                    </span>
                  </label>
                </div>
                {errors.images && (
                  <p className="mt-4 text-[10px] font-bold text-red-500 uppercase text-center">
                    {errors.images.message}
                  </p>
                )}
              </section>

              <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
                <div className="grid gap-10 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
                      <DollarSign size={12} /> Preço de Venda (R$)
                    </label>
                    <input
                      {...register("price")}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={`w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 outline-none transition-all focus:bg-white ${
                        errors.price
                          ? "border-red-500"
                          : "border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
                      <Box size={12} /> Volume em Estoque
                    </label>
                    <input
                      {...register("stock")}
                      type="number"
                      placeholder="0"
                      className={`w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 outline-none transition-all focus:bg-white ${
                        errors.stock
                          ? "border-red-500"
                          : "border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5"
                      }`}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-slate-950 uppercase">
                      Publicação Imediata
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">
                      O produto ficará disponível após a criação
                    </p>
                  </div>
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

              <div className="pt-6">
                {apiError && (
                  <div className="mb-6 rounded-xl bg-red-50 p-4 text-center border border-red-100">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                      {apiError}
                    </p>
                  </div>
                )}
                <ActionButton
                  disabled={isSubmitting || isLoadingData}
                  showArrow={!isSubmitting}
                >
                  {isSubmitting
                    ? "SINCRONIZANDO..."
                    : "FINALIZAR CADASTRO DO PRODUTO"}
                </ActionButton>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductPage;
