"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface DashboardPageHeaderProps {
  title: string;
  subtitle: string;
  backPath?: string;
  backLabel?: string;
  label?: string;
  actions?: ReactNode;
}

export const DashboardPageHeader = ({
  title,
  subtitle,
  backPath,
  backLabel,
  label,
  actions,
}: DashboardPageHeaderProps) => {
  const titleWords = title.split(" ");
  const firstWord = titleWords[0];
  const remainingWords = titleWords.slice(1).join(" ");

  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
      <div>
        {backPath && (
          <Link
            href={backPath}
            className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
          >
            <ArrowLeft size={14} /> {backLabel || "Voltar"}
          </Link>
        )}

        <div className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-[0.4em] text-indigo-600 uppercase">
          {label}
        </div>

        <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none md:text-6xl">
          {firstWord}{" "}
          <span className="text-indigo-600">
            {remainingWords}
            {remainingWords ? "." : ""}
          </span>
        </h1>

        <p className="mt-4 text-sm font-bold text-slate-400 uppercase italic">
          {subtitle}
        </p>
      </div>

      <div className="flex w-full flex-wrap gap-3 lg:w-auto">{actions}</div>
    </div>
  );
};
