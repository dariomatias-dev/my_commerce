"use client";

import { LucideIcon } from "lucide-react";

interface DashboardTotalBadgeProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
}

export const DashboardTotalBadge = ({
  icon: Icon,
  label,
  value,
  unit,
}: DashboardTotalBadgeProps) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon size={20} />
      </div>

      <div className="pr-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>

        <p className="text-lg font-black text-slate-950">
          {String(value).padStart(2, "0")} {unit}
        </p>
      </div>
    </div>
  );
};
