import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ProductFormFieldProps {
  label: string;
  icon?: LucideIcon;
  error?: string;
  children: ReactNode;
}

export const ProductFormField = ({
  label,
  icon: Icon,
  error,
  children,
}: ProductFormFieldProps) => (
  <div className="space-y-2">
    <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>

    {children}

    {error && (
      <p className="text-[10px] font-bold text-red-500 uppercase ml-1">
        {error}
      </p>
    )}
  </div>
);
