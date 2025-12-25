"use client";

import { Edit3, Search, Tag, Trash2 } from "lucide-react";

const MOCK_CATEGORIES = [
  { id: "1", name: "Sneakers", count: 12, status: "Ativo" },
  { id: "2", name: "Tech", count: 8, status: "Ativo" },
  { id: "3", name: "Acessórios", count: 24, status: "Ativo" },
  { id: "4", name: "Lifestyle", count: 5, status: "Inativo" },
];

export const CategoryManager = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="mb-8 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Filtrar categorias..."
            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-xs font-bold text-slate-950 outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {MOCK_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="group relative rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 transition-all hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Tag size={24} />
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${
                  category.status === "Ativo"
                    ? "text-emerald-500"
                    : "text-slate-300"
                }`}
              >
                {category.status}
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              {category.name}
            </h3>
            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              {category.count} Itens Vinculados
            </p>

            <div className="mt-8 flex gap-2 border-t border-slate-50 pt-6">
              <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                <Edit3 size={14} /> Editar
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-500 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
