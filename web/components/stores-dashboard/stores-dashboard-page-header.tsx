"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { DashboardPageHeader } from "../layout/dashboard-page-header";

interface StoresDashboardPageHeaderProps {
  currentPage: number;
  totalPages: number;
  title: string;
  subtitle: string;
  showCreateButton?: boolean;
  backPath: string;
  actions?: ReactNode;
}

export const StoresDashboardPageHeader = ({
  currentPage,
  totalPages,
  title,
  subtitle,
  showCreateButton = true,
  backPath,
  actions,
}: StoresDashboardPageHeaderProps) => {
  const paginationText = `Página ${currentPage + 1} de ${
    totalPages || 1
  } — ${subtitle}`;

  return (
    <DashboardPageHeader
      label="Infraestrutura de Lojas"
      title={title}
      subtitle={paginationText}
      backPath={backPath}
      actions={
        <>
          {actions}
          {showCreateButton && (
            <Link
              href="stores/new"
              className="group flex items-center gap-4 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95"
            >
              <Plus size={20} />
              CRIAR LOJA
            </Link>
          )}
        </>
      }
    />
  );
};
