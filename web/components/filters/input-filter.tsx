import { KeyboardEvent } from "react";

import { LucideIcon, X } from "lucide-react";

interface InputFilterProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  onClear: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
}

export const InputFilter = ({
  label,
  value,
  onChange,
  onClear,
  onKeyDown,
  icon: Icon,
  type = "text",
  placeholder,
}: InputFilterProps) => (
  <div className="group relative flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white px-8 py-4 shadow-sm transition-all focus-within:border-indigo-600">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
      <Icon size={18} />
    </div>

    <div className="flex flex-1 flex-col">
      <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onKeyDown={onKeyDown}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-black text-slate-950 outline-none placeholder:text-slate-200"
      />
    </div>

    {value !== "" && value !== undefined && (
      <button onClick={onClear} className="text-slate-300 transition-colors hover:text-red-500">
        <X size={16} />
      </button>
    )}
  </div>
);
