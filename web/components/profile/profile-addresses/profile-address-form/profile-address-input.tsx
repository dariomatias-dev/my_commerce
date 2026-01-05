"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface ProfileAddressInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  className?: string;
}

export const ProfileAddressInput = ({
  label,
  register,
  error,
  className = "",
  ...props
}: ProfileAddressInputProps) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="ml-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </label>

      <input
        {...register}
        {...props}
        className={`w-full rounded-xl border border-slate-100 bg-white py-3 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 text-sm transition-all ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && (
        <span className="ml-1 text-[8px] font-bold text-red-500 uppercase">
          {error}
        </span>
      )}
    </div>
  );
};
