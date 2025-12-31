"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={clsx(
        "mt-12 flex items-center justify-center gap-4",
        className
      )}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={clsx(
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          "border border-slate-200 bg-white text-slate-600 shadow-sm",
          "transition-all duration-200",
          "hover:border-indigo-600 hover:text-indigo-600",
          "active:opacity-80",
          "cursor-pointer disabled:cursor-not-allowed disabled:opacity-20",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        )}
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex items-center gap-3">
        {Array.from({ length: totalPages }, (_, i) => {
          const isActive = currentPage === i;

          return (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={clsx(
                "h-14 w-14 rounded-2xl text-[11px] font-black",
                "transition-all duration-200 cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
                isActive
                  ? "bg-slate-950 text-white shadow-2xl scale-110"
                  : "bg-white border border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={clsx(
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          "border border-slate-200 bg-white text-slate-600 shadow-sm",
          "transition-all duration-200",
          "hover:border-indigo-600 hover:text-indigo-600",
          "active:opacity-80",
          "cursor-pointer disabled:cursor-not-allowed disabled:opacity-20",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        )}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
