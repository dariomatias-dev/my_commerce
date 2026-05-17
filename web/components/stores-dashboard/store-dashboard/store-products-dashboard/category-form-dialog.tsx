"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Tag, X } from "lucide-react";
import * as z from "zod";

import { CategoryResponse } from "@/@types/category/category-response";
import { createCategory, updateCategory } from "@/app/actions/categories";
import { ActionButton } from "@/components/buttons/action-button";

const categorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  onSuccess: () => void;
  initialData?: CategoryResponse | null;
}

export const CategoryFormDialog = ({
  isOpen,
  onClose,
  storeId,
  onSuccess,
  initialData,
}: CategoryFormDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || "",
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    setApiError(null);

    const result =
      isEditing && initialData
        ? await updateCategory(initialData.id, { name: data.name, storeId })
        : await createCategory({ name: data.name, storeId });

    setIsLoading(false);

    if (!result.success) {
      setApiError(result.error);
      return;
    }

    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-6">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="animate-in zoom-in-95 fade-in slide-in-from-bottom-4 relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Tag size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
              {isEditing ? "Editar" : "Nova"} <span className="text-indigo-600">Categoria.</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10">
          {apiError && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-center">
              <p className="text-[10px] font-black tracking-widest text-red-500 uppercase">
                {apiError}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Identificação da Categoria
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Ex: Sneakers de Performance"
                disabled={isLoading}
                className={`w-full rounded-2xl border-2 bg-slate-50 px-6 py-4 font-bold text-slate-950 transition-all outline-none focus:bg-white ${
                  errors.name
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/5"
                    : "border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5"
                }`}
              />
              {errors.name && (
                <p className="ml-1 text-[10px] font-black text-red-500 uppercase">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <ActionButton disabled={isLoading} showArrow={!isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />{" "}
                    {isEditing ? "SALVANDO..." : "REGISTRANDO..."}
                  </span>
                ) : isEditing ? (
                  "SALVAR ALTERAÇÕES"
                ) : (
                  "CRIAR CATEGORIA"
                )}
              </ActionButton>
            </div>
          </div>
        </form>

        <div className="bg-slate-50/50 px-8 py-4">
          <p className="text-center text-[9px] font-bold tracking-widest text-slate-400 uppercase">
            {isEditing
              ? "As alterações serão aplicadas a todos os produtos vinculados."
              : "A categoria ficará disponível para vínculo imediato com produtos."}
          </p>
        </div>
      </div>
    </div>
  );
};
