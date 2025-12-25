"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Tag, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ApiError } from "@/@types/api";
import { ActionButton } from "@/components/buttons/action-button";
import { useCategory } from "@/hooks/use-category";

const categorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  onSuccess: () => void;
}

export const CreateCategoryDialog = ({
  isOpen,
  onClose,
  storeId,
  onSuccess,
}: CreateCategoryDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { createCategory } = useCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);
      setApiError(null);

      await createCategory({
        name: data.name,
        storeId: storeId,
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Erro ao registrar categoria.");
      }
    } finally {
      setIsLoading(false);
    }
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
              Nova <span className="text-indigo-600">Categoria.</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-950 transition-colors"
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
                className={`w-full rounded-2xl border-2 bg-slate-50 py-4 px-6 font-bold text-slate-950 outline-none transition-all focus:bg-white ${
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
                    REGISTRANDO...
                  </span>
                ) : (
                  "CRIAR CATEGORIA"
                )}
              </ActionButton>
            </div>
          </div>
        </form>

        <div className="bg-slate-50/50 px-8 py-4">
          <p className="text-center text-[9px] font-bold tracking-widest text-slate-400 uppercase">
            A categoria ficará disponível para vínculo imediato com produtos.
          </p>
        </div>
      </div>
    </div>
  );
};
