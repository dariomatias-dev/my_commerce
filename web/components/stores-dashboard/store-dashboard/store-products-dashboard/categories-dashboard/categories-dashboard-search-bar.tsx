"use client";

import { Search } from "lucide-react";

export const CategoriesDashboardSearchBar = () => (
  <section className="mb-8 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="text"
        placeholder="Filtrar categorias por nome..."
        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-xs font-bold text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white"
      />
    </div>
  </section>
);
