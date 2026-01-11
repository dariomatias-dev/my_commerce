import { LucideIcon } from "lucide-react";

interface FilterBooleanCardProps {
  isActive: boolean | undefined;
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  activeColorClass?: string;
}

export const FilterBooleanCard = ({
  isActive,
  onClick,
  icon: Icon,
  title,
  subtitle,
  activeColorClass = "border-amber-500 bg-amber-50/50 text-amber-700",
}: FilterBooleanCardProps) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between rounded-[2rem] border-2 px-8 py-5 transition-all ${
      isActive
        ? activeColorClass
        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200 shadow-sm"
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-2 rounded-xl ${
          isActive ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-300"
        }`}
      >
        <Icon size={18} />
      </div>

      <div className="flex flex-col items-start text-left">
        <span className="text-[10px] font-black uppercase tracking-widest">
          {title}
        </span>

        <span className="text-[9px] font-bold opacity-60 uppercase italic">
          {subtitle}
        </span>
      </div>
    </div>

    {isActive && (
      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
    )}
  </button>
);
