import { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export const DashboardStatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  isActive,
}: DashboardStatCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg">
    <div className="mb-4 flex items-center justify-between">
      <div className="rounded-lg bg-slate-50 p-2 text-indigo-600">
        <Icon size={18} />
      </div>
      <div
        className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${
          isActive ? "animate-pulse" : "opacity-20"
        }`}
      />
    </div>
    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
      {label}
    </p>
    <h3 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 italic">
      {value}
    </h3>
    <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
      {sub}
    </p>
  </div>
);
