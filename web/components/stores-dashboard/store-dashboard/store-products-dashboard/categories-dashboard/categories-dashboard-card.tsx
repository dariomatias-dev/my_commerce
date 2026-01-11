"use client";

import { Edit3, Tag, Trash2 } from "lucide-react";

import { CategoryResponse } from "@/@types/category/category-response";

interface CategoriesDashboardCardProps {
  category: CategoryResponse;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (category: CategoryResponse) => void;
}

export const CategoriesDashboardCard = ({
  category,
  onEdit,
  onDelete,
}: CategoriesDashboardCardProps) => (
  <div className="group relative rounded-[2rem] border border-slate-200 bg-white p-5 transition-all hover:border-indigo-600 hover:shadow-lg">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Tag size={18} />
        </div>

        <div className="overflow-hidden">
          <h3 className="truncate text-sm font-black tracking-tight text-slate-950">
            {category.name}
          </h3>
        </div>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={() => onEdit(category)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => onDelete(category)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:border-red-500 hover:text-red-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  </div>
);
