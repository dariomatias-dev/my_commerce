import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductManagerPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductManagerPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: ProductManagerPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 disabled:opacity-20"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`h-12 w-12 rounded-xl text-[11px] font-black ${
              currentPage === i
                ? "bg-slate-950 text-white shadow-2xl scale-110"
                : "bg-white border-2 border-slate-200 text-slate-400"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 disabled:opacity-20"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
