import { Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageThumbProps {
  src?: string;
  alt: string;
}

export const ProductImageThumb = ({ src, alt }: ProductImageThumbProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const showFallback = !src || error || !loaded;

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
      {showFallback && <Package className="h-full w-full p-3 text-slate-300" />}

      {src && (
        <Image
          src={process.env.NEXT_PUBLIC_API_URL + "/files/stores/" + src}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity ${
            loaded && !error ? "opacity-100" : "opacity-0"
          }`}
          fill
          unoptimized
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};
