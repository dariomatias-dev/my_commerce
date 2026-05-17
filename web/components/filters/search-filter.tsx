import { KeyboardEvent } from "react";

import { Search, XCircle } from "lucide-react";

interface SearchFilterProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  placeholder?: string;
}

export const SearchFilter = ({
  value,
  onChange,
  onClear,
  onKeyDown,
  placeholder = "PESQUISAR...",
}: SearchFilterProps) => (
  <div className="group relative flex-1">
    <Search
      className="absolute top-1/2 left-6 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
      size={20}
    />

    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full rounded-[2rem] border border-slate-100 bg-white px-14 py-5 text-[11px] font-black tracking-widest text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5"
    />

    {value && (
      <button
        onClick={onClear}
        className="absolute top-1/2 right-6 -translate-y-1/2 text-slate-300 transition-all hover:text-red-500"
      >
        <XCircle size={20} />
      </button>
    )}
  </div>
);
