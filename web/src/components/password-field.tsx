"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-2">
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
            <Lock size={18} />
          </div>

          <input
            {...props}
            ref={ref}
            type={showPassword ? "text" : "password"}
            placeholder={props.placeholder || "••••••••"}
            className={`w-full rounded-2xl border bg-slate-50 py-4 pr-12 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/5"
                : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/5"
            } ${className}`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-300 transition-colors hover:text-indigo-600"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="ml-1 text-[10px] font-bold tracking-wider text-red-500 uppercase">
            {error}
          </p>
        )}
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";
