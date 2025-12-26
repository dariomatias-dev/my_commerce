"use client";

import { Check, ChevronDown, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { CategoryResponse } from "@/@types/category/category-response";

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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue = watch(name);
  const selectedCategory = categories.find((cat) => cat.id === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setValue(name, id as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase flex items-center gap-2">
        <Layers
          size={12}
          className={error ? "text-red-500" : "text-indigo-600"}
        />
        Categoria Vinculada
      </label>

      <div className="relative group">
        <button
          type="button"
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between rounded-2xl border-2 py-4.5 px-6 
            text-[11px] font-black uppercase italic tracking-wider
            outline-none transition-all duration-300
            ${
              isOpen
                ? "border-indigo-600 bg-white shadow-lg"
                : "border-slate-100 bg-slate-50 hover:border-slate-300"
            }
            ${error ? "border-red-500/50 bg-red-50/10" : ""}
            ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <span
            className={selectedCategory ? "text-slate-950" : "text-slate-400"}
          >
            {isLoading
              ? "Sincronizando Database..."
              : selectedCategory
              ? selectedCategory.name
              : "— Selecionar Categoria —"}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180 text-indigo-600" : "text-slate-400"
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 z-50 overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto pr-1">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`
                      w-full flex items-center justify-between rounded-xl px-5 py-4
                      text-[10px] font-black uppercase italic tracking-widest transition-all
                      ${
                        selectedValue === cat.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                      }
                    `}
                  >
                    {cat.name}
                    {selectedValue === cat.id && (
                      <Check
                        size={14}
                        strokeWidth={4}
                        className="animate-in zoom-in duration-300"
                      />
                    )}
                  </button>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 italic">
                    Nenhum registro localizado
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={`
          absolute bottom-0 left-6 right-6 h-0.5 transition-all duration-500 scale-x-0 group-focus-within:scale-x-100
          ${error ? "bg-red-500" : "bg-indigo-600"}
          ${isOpen ? "scale-x-100" : ""}
        `}
        />
      </div>

      {error && (
        <p className="ml-1 text-[9px] font-black text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-left-1">
          {error}
        </p>
      )}
    </div>
  );
};
