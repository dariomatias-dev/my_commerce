import { LucideIcon } from "lucide-react";

interface FilterToggleProps {
  isActive: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  activeClassName?: string;
}

export const FilterToggle = ({
  isActive,
  onClick,
  icon: Icon,
  label,
  activeClassName = "bg-white text-emerald-600 shadow-sm",
}: FilterToggleProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
      isActive ? activeClassName : "text-slate-500 hover:text-slate-700"
    }`}
  >
    <Icon size={14} /> {label}
  </button>
);
