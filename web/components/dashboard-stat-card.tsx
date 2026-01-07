"use client";

import { AlertCircle, Loader2, LucideIcon, TrendingUp } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value?: string;
  sub?: string;
  icon: LucideIcon;
  isActive?: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export const DashboardStatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  isActive,
  isLoading,
  errorMessage,
  onRetry,
}: DashboardStatCardProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-45 flex-col items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
        <Loader2 className="animate-spin text-indigo-600" size={24} />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-45 flex-col items-center justify-center rounded-[2.5rem] border border-red-50 bg-red-50/30 p-8 text-center shadow-sm">
        <AlertCircle className="mb-2 text-red-500" size={24} />
        <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
          {errorMessage}
        </p>
        <button
          onClick={onRetry}
          className="mt-3 text-[10px] font-black uppercase tracking-widest text-red-700 underline underline-offset-4 transition-colors hover:text-red-900"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-950 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <Icon size={24} />
        </div>
        
        {sub ? (
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${
            isActive 
              ? "bg-emerald-50 text-emerald-600 animate-in fade-in" 
              : "bg-slate-50 text-slate-400"
          }`}>
            {isActive && <TrendingUp size={12} className="animate-pulse" />}
            {sub}
          </span>
        ) : (
          <div className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isActive ? "animate-ping" : "hidden"}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-200"}`} />
          </div>
        )}
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <h3 className="mt-1 text-3xl font-black tracking-tighter text-slate-950">
        {value || "---"}
      </h3>
    </div>
  );
};