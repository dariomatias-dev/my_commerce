"use client";

import { Edit3, Tag, Trash2 } from "lucide-react";

import { CategoryResponse } from "@/@types/category/category-response";

interface DashboardCategoryCardProps {
  category: CategoryResponse;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (category: CategoryResponse) => void;
}

export const DashboardCategoryCard = ({
  category,
  onEdit,
  onDelete,
}: DashboardCategoryCardProps) => (
  <div className="group relative rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 transition-all hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5">
    <div className="mb-6 flex items-center justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <Tag size={24} />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
        Taxonomia
      </span>
    </div>

    <h3 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
      {category.name}
    </h3>

    <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      Criado em: {new Date(category.createdAt).toLocaleDateString("pt-BR")}
    </p>

    <div className="mt-8 flex gap-2 border-t border-slate-50 pt-6">
      <button
        onClick={() => onEdit(category)}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all"
      >
        <Edit3 size={14} /> Editar
      </button>

      <button
        onClick={() => onDelete(category)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-500 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);
