import { Filter, Search } from "lucide-react";

export const ProductsDashboardFilter = () => (
  <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
    <div className="relative flex-1">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="text"
        placeholder="Filtrar por nome ou SKU..."
        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-xs font-bold text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white"
      />
    </div>

    <button className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-5 py-3.5 text-[10px] font-black tracking-widest text-slate-500 uppercase hover:border-indigo-600 hover:text-indigo-600 transition-all">
      <Filter size={16} /> Parâmetros
    </button>
  </section>
);
