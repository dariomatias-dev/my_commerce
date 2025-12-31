"use client";

import { CategoryResponse } from "@/@types/category/category-response";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface StoreCategoryTabsProps {
  categories: CategoryResponse[];
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
}

export const StoreCategoryTabs = ({
  categories,
  activeCategoryId,
  onCategoryChange,
}: StoreCategoryTabsProps) => {
  return (
    <ScrollArea className="w-full pb-4">
      <div className="flex items-center gap-3 no-scrollbar cursor-grab active:cursor-grabbing px-2 overflow-y-hidden">
        <button
          onClick={() => onCategoryChange("all")}
          className={`whitespace-nowrap rounded-2xl px-8 py-4 text-[11px] font-black tracking-[0.3em] uppercase transition-all border-2 ${
            activeCategoryId === "all"
              ? "bg-slate-950 text-white border-slate-950 shadow-xl scale-105"
              : "bg-white text-slate-400 border-slate-100 hover:border-indigo-600 hover:text-slate-950"
          }`}
        >
          Todos os Produtos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`whitespace-nowrap rounded-2xl px-8 py-4 text-[11px] font-black tracking-[0.3em] uppercase transition-all border-2 ${
              activeCategoryId === cat.id
                ? "bg-slate-950 text-white border-slate-950 shadow-xl scale-105"
                : "bg-white text-slate-400 border-slate-100 hover:border-indigo-600 hover:text-slate-950"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
