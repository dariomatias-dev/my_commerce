"use client";

import { Plus, Zap } from "lucide-react";
import Link from "next/link";

interface StoresDashboardPageHeaderProps {
  currentPage: number;
  totalPages: number;
  title: string;
  subtitle: string;
  showCreateButton?: boolean;
}

export const StoresDashboardPageHeader = ({
  currentPage,
  totalPages,
  title,
  subtitle,
  showCreateButton = true,
}: StoresDashboardPageHeaderProps) => (
  <div className="mb-16 border-b border-slate-200 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div>
      <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase">
        <Zap size={14} fill="currentColor" />
        Infraestrutura de Lojas
      </div>

      <h1 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
        {title.split(" ")[0]}{" "}
        <span className="text-indigo-600">
          {title.split(" ").slice(1).join(" ")}
        </span>
      </h1>

      <p className="mt-4 text-sm font-bold text-slate-400 uppercase italic">
        Página {currentPage + 1} de {totalPages || 1} — {subtitle}.
      </p>
    </div>

    {showCreateButton && (
      <Link
        href="/dashboard/store/new"
        className="group flex items-center gap-4 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95"
      >
        <Plus size={20} />
        CRIAR LOJA
      </Link>
    )}
  </div>
);
