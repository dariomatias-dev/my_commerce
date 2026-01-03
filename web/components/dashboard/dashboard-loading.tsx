import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface DashboardLoadingProps {
  message?: string;
  icon?: ReactNode;
  className?: string;
}

export const DashboardLoading = ({
  message = "Carregando...",
  icon,
  className,
}: DashboardLoadingProps) => (
  <div
    className={cn(
      "flex min-h-screen flex-col items-center justify-center gap-8",
      className
    )}
  >
    {icon || <Loader2 className="h-14 w-14 animate-spin text-indigo-600" />}

    <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">
      {message}
    </p>
  </div>
);
