import Image from "next/image";
import { ElementType, useEffect, useState } from "react";

interface StoreFileUploadFieldProps {
  label: string;
  file?: FileList;
  existingUrl: string | null;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ElementType;
}

export const StoreFileUploadField = ({
  label,
  file,
  existingUrl,
  error,
  onChange,
  icon: Icon,
}: StoreFileUploadFieldProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const handlePreviewUpdate = () => {
      if (file && file.length > 0) {
        const url = URL.createObjectURL(file[0]);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
      setPreview(existingUrl);
    };

    const cleanup = handlePreviewUpdate();
    return () => {
      if (cleanup) cleanup();
    };
  }, [file, existingUrl]);

  return (
    <div className="space-y-4">
      <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </label>

      <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-indigo-600 hover:bg-indigo-50/30">
        {preview ? (
          <Image
            src={preview}
            alt={label}
            fill
            unoptimized
            className="object-cover"
          />
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
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={onChange}
        />
      </label>

      {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
    </div>
  );
};
