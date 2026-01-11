import { KeyboardEvent } from "react";
import { Search, XCircle } from "lucide-react";

interface FilterSearchProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  placeholder?: string;
}

export const FilterSearch = ({
  value,
  onChange,
  onClear,
  onKeyDown,
  placeholder = "PESQUISAR...",
}: FilterSearchProps) => (
  <div className="relative flex-1 group">
    <Search
      className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
      size={20}
    />

    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="w-full rounded-[2rem] border border-slate-100 bg-white px-14 py-5 text-[11px] font-black tracking-widest text-slate-950 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 placeholder:text-slate-400 shadow-sm"
    />

    {value && (
      <button
        onClick={onClear}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-all"
      >
        <XCircle size={20} />
      </button>
    )}
  </div>
);
