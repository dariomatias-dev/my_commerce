"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

import { ProductFormValues } from "@/app/dashboard/store/[slug]/products/new/page";

interface ProductMediaGalleryProps {
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  error?: string;
}

export const ProductMediaGallery = ({
  watch,
  setValue,
  error,
}: ProductMediaGalleryProps) => {
  const selectedImages = watch("images");

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setValue("images", [...selectedImages, ...files], {
        shouldValidate: true,
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setValue("images", newImages, { shouldValidate: true });
  };

  const previews = selectedImages.map((file) => URL.createObjectURL(file));

  return (
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
            <Image src={url} alt="Preview" fill className="object-cover" />
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

      {error && (
        <p className="mt-4 text-[10px] font-bold text-red-500 uppercase text-center">
          {error}
        </p>
      )}
    </section>
  );
};
