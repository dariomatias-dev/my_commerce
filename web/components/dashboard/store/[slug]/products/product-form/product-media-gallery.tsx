"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

import { ProductFormValues } from "@/schemas/product.schema";

interface ExistingImage {
  name: string;
  url: string;
}

interface ProductMediaGalleryProps {
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  error?: string;
  existingImages?: ExistingImage[];
  onRemoveExisting?: (name: string) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const ProductMediaGallery = ({
  watch,
  setValue,
  error,
  existingImages = [],
  onRemoveExisting,
}: ProductMediaGalleryProps) => {
  const selectedImages = watch("images") || [];

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      ALLOWED_TYPES.includes(file.type)
    );

    if (files.length > 0) {
      setValue("images", [...selectedImages, ...files], {
        shouldValidate: true,
      });
    }

    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setValue("images", newImages, { shouldValidate: true });
  };

  return (
    <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
      <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
        Galeria de Mídia
      </label>

      <p className="mb-6 text-[10px] font-semibold text-slate-500 uppercase">
        Apenas imagens JPG, JPEG ou PNG
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {existingImages.map((img) => (
          <div
            key={img.url}
            className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-indigo-100"
          >
            <Image
              src={img.url}
              alt="Existing"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onRemoveExisting?.(img.name)}
              className="absolute right-2 top-2 h-7 w-7 flex items-center justify-center rounded-lg bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 rounded bg-indigo-600 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
              Salva
            </div>
          </div>
        ))}

        {selectedImages.map((file: File, index: number) => {
          const url = URL.createObjectURL(file);
          return (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-slate-100"
            >
              <Image src={url} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="absolute right-2 top-2 h-7 w-7 flex items-center justify-center rounded-lg bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
                Nova
              </div>
            </div>
          );
        })}

        <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-600 hover:bg-indigo-50/30">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
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
