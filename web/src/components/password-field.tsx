"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const PasswordField = ({ value, onChange }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="group relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
        <Lock size={18} />
      </div>

      <input
        type={showPassword ? "text" : "password"}
        value={value}
        required={true}
        placeholder="••••••••"
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-12 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
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
  );
};
