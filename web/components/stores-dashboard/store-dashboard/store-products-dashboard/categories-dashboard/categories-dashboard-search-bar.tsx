"use client";

import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

interface CategoriesDashboardSearchBarProps {
  onSearch: (value: string) => void;
}

export const CategoriesDashboardSearchBar = ({
  onSearch,
}: CategoriesDashboardSearchBarProps) => {
  const [name, setName] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(name);
    }
  };

  return (
    <section className="mb-8">
      <div className="relative">
        <Search
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="PESQUISAR E PRESSIONAR ENTER PARA APLICAR..."
          className="w-full rounded-[2rem] border border-slate-100 bg-white px-14 py-5 text-[11px] font-black tracking-widest text-slate-950 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 placeholder:text-slate-400 shadow-sm"
        />
      </div>
    </section>
  );
};
