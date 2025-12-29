import { Package } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

import { ProductResponse } from "@/@types/product/product-response";

interface ProductImageThumbProps {
  product: ProductResponse;
  alt: string;
  size?: number;
  className?: string;
  fallbackIcon?: ReactNode;
  baseUrl?: string;
}

export const ProductImageThumb = ({
  product,
  alt,
  size = 56,
  className = "",
  fallbackIcon,
}: ProductImageThumbProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const src = product.images?.[0]?.url;
  const showFallback = !src || error || !loaded;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl bg-slate-50 ${className}`}
      style={{ width: size, height: size }}
    >
      {showFallback &&
        (fallbackIcon ?? (
          <Package className="h-full w-full p-3 text-slate-300" />
        ))}

      {src && (
        <Image
          src={process.env.NEXT_PUBLIC_API_URL + "/files/stores/" + src}
          alt={alt}
          fill
          unoptimized
          className={`object-cover transition-opacity ${
            loaded && !error ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};
