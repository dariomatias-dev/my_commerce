"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardCategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DashboardCategoryPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: DashboardCategoryPaginationProps) => (
  <div className="mt-12 flex items-center justify-center gap-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 0}
      className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-20 shadow-sm"
    >
      <ChevronLeft size={20} />
    </button>

    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`h-12 w-12 rounded-xl text-[11px] font-black transition-all ${
            currentPage === i
              ? "bg-slate-950 text-white shadow-2xl scale-110"
              : "bg-white border-2 border-slate-200 text-slate-400 hover:border-indigo-600"
          }`}
        >
          {String(i + 1).padStart(2, "0")}
        </button>
      ))}
    </div>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages - 1}
      className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-20 shadow-sm"
    >
      <ChevronRight size={20} />
    </button>
  </div>
);
