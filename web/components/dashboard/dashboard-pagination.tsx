import { ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DashboardPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: DashboardPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-24 flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-20 shadow-sm"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex items-center gap-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`h-14 w-14 rounded-2xl text-[11px] font-black transition-all ${
              currentPage === i
                ? "bg-slate-950 text-white shadow-2xl scale-110"
                : "bg-white border border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-20 shadow-sm"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
