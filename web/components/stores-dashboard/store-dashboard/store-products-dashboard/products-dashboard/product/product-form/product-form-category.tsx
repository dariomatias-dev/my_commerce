"use client";

import { Layers } from "lucide-react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { CategoryResponse } from "@/@types/category/category-response";
import { Dropdown } from "@/components/dropdown";

interface ProductFormCategorySelectProps<T extends FieldValues> {
  categories: CategoryResponse[];
  isLoading: boolean;
  error?: string;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  name: Path<T>;
}

export const ProductFormCategorySelect = <T extends FieldValues>({
  categories,
  isLoading,
  error,
  setValue,
  watch,
  name,
}: ProductFormCategorySelectProps<T>) => {
  const selectedValue = watch(name);

  const handleSelect = (id: string) => {
    setValue(name, id as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="space-y-2">
      <Dropdown
        label="Categoria Vinculada"
        icon={Layers}
        options={categories}
        value={selectedValue}
        onChange={handleSelect}
        placeholder={
          isLoading ? "Sincronizando Database..." : "— Selecionar Categoria —"
        }
        className={error ? "border-red-500/50" : ""}
        buttonClassName="bg-slate-50 focus:bg-white"
      />

      {error && (
        <p className="ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-left-1">
          {error}
        </p>
      )}
    </div>
  );
};
