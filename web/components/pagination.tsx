"use client";

import {
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: LucideIcon;
}

const NavButton = ({ onClick, disabled, icon: Icon }: NavButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl",
      "border border-slate-200 bg-white text-slate-600 shadow-sm",
      "transition-all duration-200",
      "hover:border-indigo-600 hover:text-indigo-600",
      "active:opacity-80",
      "cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:text-slate-400",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
    )}
  >
    <Icon size={20} />
  </button>
);

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 6) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage < 3) {
      for (let i = 0; i < 4; i++) pages.push(i);
      pages.push("ellipsis-end");
      pages.push(totalPages - 1);
    } else if (currentPage > totalPages - 4) {
      pages.push(0);
      pages.push("ellipsis-start");
      for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      pages.push("ellipsis-start");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("ellipsis-end");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "mt-12 flex items-center justify-center gap-2 sm:gap-4",
        className,
      )}
    >
      <NavButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        icon={ChevronLeft}
      />

      <div className="flex items-center gap-2 sm:gap-3">
        {getPages().map((page, index) => {
          if (typeof page === "string") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="hidden md:flex h-12 w-8 sm:h-14 sm:w-10 items-center justify-center text-slate-300"
              >
                <MoreHorizontal size={20} />
              </div>
            );
          }

          const isActive = currentPage === page;

          const isVisibleMobile =
            isActive ||
            (currentPage === 0 && page <= 2) ||
            (currentPage === totalPages - 1 && page >= totalPages - 3) ||
            Math.abs(currentPage - Number(page)) <= 1;

          return (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={cn(
                "flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl text-[10px] sm:text-[11px] font-black",
                "transition-all duration-200 cursor-pointer border",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
                isActive
                  ? "bg-slate-950 text-white border-slate-950 shadow-xl scale-110 z-10 flex"
                  : cn(
                      "bg-white border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600",
                      isVisibleMobile ? "flex" : "hidden md:flex",
                    ),
              )}
            >
              {String(Number(page) + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <NavButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        icon={ChevronRight}
      />
    </div>
  );
};
