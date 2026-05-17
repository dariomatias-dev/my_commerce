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
      <div className="no-scrollbar flex cursor-grab items-center gap-3 overflow-y-hidden px-2 active:cursor-grabbing">
        <button
          onClick={() => onCategoryChange("all")}
          className={`rounded-2xl border-2 px-8 py-4 text-[11px] font-black tracking-[0.3em] whitespace-nowrap uppercase transition-all ${
            activeCategoryId === "all"
              ? "scale-105 border-slate-950 bg-slate-950 text-white shadow-xl"
              : "border-slate-100 bg-white text-slate-400 hover:border-indigo-600 hover:text-slate-950"
          }`}
        >
          Todos os Produtos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`rounded-2xl border-2 px-8 py-4 text-[11px] font-black tracking-[0.3em] whitespace-nowrap uppercase transition-all ${
              activeCategoryId === cat.id
                ? "scale-105 border-slate-950 bg-slate-950 text-white shadow-xl"
                : "border-slate-100 bg-white text-slate-400 hover:border-indigo-600 hover:text-slate-950"
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
