import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  imagePath?: string;
  alt: string;
  size?: number;
  fill?: boolean;
  className?: string;
  objectFit?: "cover" | "contain";
}

export const ProductImage = ({
  imagePath,
  alt,
  size = 96,
  fill = false,
  className = "",
  objectFit = "cover",
}: ProductImageProps) => {
  const [error, setError] = useState(false);

  const imageUrl = imagePath
    ? `${process.env.NEXT_PUBLIC_API_URL}/files/stores/${imagePath}`
    : null;

  if (!imageUrl || error) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-slate-50 text-slate-300 ${
          fill ? "h-full w-full" : ""
        } ${className}`}
        style={!fill ? { width: size, height: size } : undefined}
      >
        <ImageIcon size={32} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "h-full w-full" : "rounded-2xl"
      } ${className}`}
      style={!fill ? { width: size, height: size } : undefined}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        unoptimized
        className={objectFit === "cover" ? "object-cover" : "object-contain"}
        onError={() => setError(true)}
      />
    </div>
  );
};
